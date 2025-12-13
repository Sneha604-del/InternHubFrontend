import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-splash-screen',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="splash-container" [class.fade-out]="isHiding">
      <div class="grid-bg"></div>
      <div class="content">
        <div class="logo-orbit">
          <div class="orbit-ring"></div>
          <div class="orbit-ring ring-2"></div>
          <div class="orbit-ring ring-3"></div>
          <img src="logo.jpeg" alt="InternHub" class="logo">
          <div class="orbit-dot dot-1"></div>
          <div class="orbit-dot dot-2"></div>
          <div class="orbit-dot dot-3"></div>
        </div>
        <div class="text-content">
          <h1 class="title">InternHub</h1>
          <div class="subtitle">Find Your Perfect Internship</div>
          <div class="spinner">
            <div class="spinner-segment"></div>
            <div class="spinner-segment"></div>
            <div class="spinner-segment"></div>
            <div class="spinner-segment"></div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .splash-container {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, #4169e1 0%, #1e3a8a 100%);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
      transition: all 0.6s ease;
      overflow: hidden;
    }

    .fade-out {
      opacity: 0;
      transform: scale(1.2);
    }

    .grid-bg {
      position: absolute;
      width: 100%;
      height: 100%;
      background-image: 
        linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px);
      background-size: 50px 50px;
      animation: gridMove 20s linear infinite;
    }

    .content {
      text-align: center;
      animation: contentZoom 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }

    .logo-orbit {
      position: relative;
      width: 160px;
      height: 160px;
      margin: 0 auto 40px;
    }

    .orbit-ring {
      position: absolute;
      border: 2px solid rgba(255,255,255,0.3);
      border-radius: 50%;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }

    .orbit-ring:nth-child(1) {
      width: 120px;
      height: 120px;
      animation: orbitSpin 4s linear infinite;
    }

    .orbit-ring.ring-2 {
      width: 140px;
      height: 140px;
      animation: orbitSpin 6s linear infinite reverse;
    }

    .orbit-ring.ring-3 {
      width: 160px;
      height: 160px;
      animation: orbitSpin 8s linear infinite;
    }

    .logo {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 80px;
      height: 80px;
      border-radius: 50%;
      object-fit: cover;
      border: 4px solid white;
      box-shadow: 0 0 30px rgba(255,255,255,0.5);
      animation: logoGlow 2s ease-in-out infinite alternate;
    }

    .orbit-dot {
      position: absolute;
      width: 8px;
      height: 8px;
      background: white;
      border-radius: 50%;
      box-shadow: 0 0 10px rgba(255,255,255,0.8);
    }

    .dot-1 {
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      animation: orbitDot 4s linear infinite;
    }

    .dot-2 {
      top: 50%;
      right: 10px;
      transform: translateY(-50%);
      animation: orbitDot 6s linear infinite reverse;
    }

    .dot-3 {
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      animation: orbitDot 8s linear infinite;
    }

    .text-content {
      animation: textSlide 1s ease-out 0.5s both;
    }

    .title {
      font-size: 44px;
      font-weight: 900;
      color: white;
      margin: 0 0 12px 0;
      letter-spacing: 2px;
      text-shadow: 0 0 20px rgba(255,255,255,0.3);
      animation: titlePulse 3s ease-in-out infinite;
    }

    .subtitle {
      font-size: 16px;
      color: rgba(255,255,255,0.8);
      margin-bottom: 30px;
      font-weight: 300;
    }

    .spinner {
      display: flex;
      justify-content: center;
      gap: 4px;
    }

    .spinner-segment {
      width: 6px;
      height: 20px;
      background: rgba(255,255,255,0.7);
      border-radius: 3px;
      animation: spinnerBounce 1.2s ease-in-out infinite;
    }

    .spinner-segment:nth-child(1) { animation-delay: -0.3s; }
    .spinner-segment:nth-child(2) { animation-delay: -0.2s; }
    .spinner-segment:nth-child(3) { animation-delay: -0.1s; }
    .spinner-segment:nth-child(4) { animation-delay: 0s; }

    @keyframes gridMove {
      0% { transform: translate(0, 0); }
      100% { transform: translate(50px, 50px); }
    }

    @keyframes contentZoom {
      0% {
        opacity: 0;
        transform: scale(0.5);
      }
      100% {
        opacity: 1;
        transform: scale(1);
      }
    }

    @keyframes orbitSpin {
      0% { transform: translate(-50%, -50%) rotate(0deg); }
      100% { transform: translate(-50%, -50%) rotate(360deg); }
    }

    @keyframes orbitDot {
      0% { opacity: 1; }
      50% { opacity: 0.3; }
      100% { opacity: 1; }
    }

    @keyframes logoGlow {
      0% { box-shadow: 0 0 30px rgba(255,255,255,0.5); }
      100% { box-shadow: 0 0 50px rgba(255,255,255,0.8); }
    }

    @keyframes textSlide {
      0% {
        opacity: 0;
        transform: translateY(30px);
      }
      100% {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes titlePulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }

    @keyframes spinnerBounce {
      0%, 80%, 100% {
        transform: scaleY(1);
      }
      40% {
        transform: scaleY(1.5);
      }
    }
  `]
})
export class SplashScreenComponent implements OnInit {
  @Output() splashComplete = new EventEmitter<void>();
  isHiding = false;

  ngOnInit() {
    setTimeout(() => {
      this.isHiding = true;
      setTimeout(() => {
        this.splashComplete.emit();
      }, 800);
    }, 2000);
  }
}