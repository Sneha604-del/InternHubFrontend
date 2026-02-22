import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment';

declare var Razorpay: any;

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = `${environment.apiUrl}/api/payment`;

  constructor(private http: HttpClient) {}

  createOrder(amount: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/create-order`, { amount: amount * 100 });
  }

  verifyPayment(paymentData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/verify`, paymentData);
  }

  openRazorpay(orderData: any, onSuccess: (response: any) => void, onFailure: (error: any) => void) {
    console.log('🔵 openRazorpay called with:', orderData);
    
    if (typeof Razorpay === 'undefined') {
      console.error('❌ Razorpay SDK not loaded');
      onFailure({ message: 'Razorpay SDK not loaded' });
      return;
    }

    console.log('✅ Razorpay SDK loaded');

    const options = {
      key: orderData.key,
      amount: orderData.amount,
      currency: orderData.currency,
      name: 'InternHub',
      description: 'Internship Application Fee',
      order_id: orderData.orderId,
      handler: (response: any) => {
        console.log('✅ Payment successful:', response);
        onSuccess(response);
      },
      prefill: {
        name: orderData.userName || '',
        email: orderData.userEmail || '',
        contact: orderData.userPhone || ''
      },
      theme: {
        color: '#667eea'
      },
      modal: {
        ondismiss: () => {
          console.log('⚠️ Payment cancelled by user');
          onFailure({ message: 'Payment cancelled by user' });
        }
      }
    };

    console.log('🔵 Razorpay options:', options);

    try {
      const rzp = new Razorpay(options);
      console.log('✅ Razorpay instance created, opening modal...');
      rzp.open();
      console.log('✅ Razorpay modal opened');
    } catch (error) {
      console.error('❌ Failed to open Razorpay:', error);
      onFailure({ message: 'Failed to open payment window' });
    }
  }
}
