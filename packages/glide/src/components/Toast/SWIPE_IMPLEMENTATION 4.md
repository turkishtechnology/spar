# Toast Swipe Dismiss Implementation

Bu implementasyon, toast bileşenlerine mouse ve touch swipe gesture desteği ekler. Kullanıcılar toast'ları kapatmak için sürükleyebilir.

## 🎯 Özellikler

### ✅ Swipe Gesture Desteği

- **Mouse Support**: Fare ile tıklayıp sürükleme
- **Touch Support**: Dokunmatik cihazlarda parmak ile sürükleme
- **4 Yön**: Yukarı, aşağı, sol, sağ tüm yönlerde swipe desteği
- **Configurable Threshold**: Minimum swipe mesafesi ayarlanabilir (default: 50px)
- **Velocity Detection**: Hız tabanlı swipe algılama

### 🎨 Animasyon & CSS

- **Real-time Feedback**: Swipe sırasında görsel geri bildirim
- **Direction-aware Animations**: Yön bazlı çıkış animasyonları
- **Smooth Transitions**: Pürüzsüz geçişler ve dönüşümler
- **Accessibility**: Reduced motion desteği

### ⚙️ API & Hooks

- **useSwipeGesture**: Yeniden kullanılabilir swipe gesture hook'u
- **Event Callbacks**: onSwipeStart, onSwipeEnd callback'leri
- **Timer Integration**: Swipe sırasında timer duraklatma
- **TypeScript**: Tam tip güvenliği

## 📁 Yeni Dosyalar

### 1. `useSwipeGesture.ts` - Ana Swipe Hook'u

```typescript
export function useSwipeGesture({
  threshold = 50,
  velocityThreshold = 0.3,
  preventScroll = true,
  enableMouse = true,
  enableTouch = true,
  onSwipeStart,
  onSwipeMove,
  onSwipeEnd,
  onSwipeCancel,
}: UseSwipeGestureProps): UseSwipeGestureReturn;
```

**Özellikler:**

- Cross-platform koordinat hesaplama
- Direction detection (4 yön)
- Distance & velocity calculation
- Event handling (mouse/touch)
- State management (isSwping, currentSwipe)

### 2. `Toast.types.ts` - Tip Genişletmeleri

```typescript
// Yeni tipler
export type SwipeDirection = 'up' | 'down' | 'left' | 'right';

export interface SwipeEvent {
  readonly startCoordinates: SwipeCoordinates;
  readonly currentCoordinates: SwipeCoordinates;
  readonly direction: SwipeDirection | null;
  readonly distance: number;
  readonly velocity: number;
  readonly timestamp: number;
}

// ToastConfig genişletildi
export interface ToastConfig {
  // ... mevcut props
  readonly onSwipeStart?: (direction: SwipeDirection) => void;
  readonly onSwipeEnd?: (direction: SwipeDirection) => void;
  readonly swipeThreshold?: number;
}

// ToastRootProps genişletildi
export interface ToastRootProps {
  // ... mevcut props
  onSwipeStart?: (direction: SwipeDirection) => void;
  onSwipeEnd?: (direction: SwipeDirection) => void;
  swipeThreshold?: number;
}
```

### 3. `toast.css` - Swipe CSS Animasyonları

```css
/* Swipe gesture states */
[data-toast-root] {
  cursor: grab;
  transition:
    transform 0.2s ease-out,
    opacity 0.2s ease-out;
  user-select: none;
  touch-action: pan-y;
}

[data-toast-root][data-swping='true'] {
  transition: none;
  will-change: transform;
}

/* Direction-specific animations */
@keyframes toast-swipe-out-left {
  to {
    opacity: 0;
    transform: translateX(-100%);
  }
}

@keyframes toast-swipe-out-right {
  to {
    opacity: 0;
    transform: translateX(100%);
  }
}

@keyframes toast-swipe-out-up {
  to {
    opacity: 0;
    transform: translateY(-100%);
  }
}

@keyframes toast-swipe-out-down {
  to {
    opacity: 0;
    transform: translateY(100%);
  }
}
```

### 4. Test Dosyaları

- `__tests__/useSwipeGesture.test.tsx` - Hook testleri (10 test case)
- `__tests__/ToastRoot.swipe.test.tsx` - Entegrasyon testleri

## 🔧 ToastRoot Entegrasyonu

```typescript
// ToastRoot.tsx güncellendi
import { useSwipeGesture } from './useSwipeGesture';

export const ToastRoot = ({
  // ... mevcut props
  onSwipeStart,
  onSwipeEnd,
  swipeThreshold = 50,
}: ToastRootProps) => {
  // Swipe gesture handlers
  const handleSwipeStart = useCallback((swipeEvent: SwipeEvent) => {
    setIsPaused(true); // Timer'ı duraklat
    onSwipeStart?.(swipeEvent.direction!);
  }, [onSwipeStart]);

  const handleSwipeEnd = useCallback((swipeEvent: SwipeEvent) => {
    setIsPaused(false); // Timer'ı devam ettir

    if (swipeEvent.direction) {
      onSwipeEnd?.(swipeEvent.direction);
      setOpen(false); // Toast'ı kapat
      onDurationEnd?.();
    }
  }, [onSwipeEnd, setOpen, onDurationEnd]);

  // Swipe hook initialization
  const { isSwping, currentSwipe, handlers } = useSwipeGesture({
    threshold: swipeThreshold,
    onSwipeStart: handleSwipeStart,
    onSwipeEnd: handleSwipeEnd,
    // ... diğer ayarlar
  });

  return (
    <Component
      // ... mevcut props
      onMouseDown={handlers.onMouseDown}
      onTouchStart={handlers.onTouchStart}
      data-swping={isSwping}
      data-swipe-direction={currentSwipe?.direction || null}
    >
      {children}
    </Component>
  );
};
```

## 📱 Kullanım Örnekleri

### Basit Swipe Toast

```typescript
import { toast } from '@glide/toast';

toast.success('Swipe me to dismiss!', {
  onSwipeEnd: (direction) => {
    console.log(`Swiped ${direction}`);
  },
});
```

### Custom Threshold

```typescript
toast.info('Swipe 100px to dismiss', {
  swipeThreshold: 100,
  onSwipeStart: (direction) => console.log(`Started swiping ${direction}`),
  onSwipeEnd: (direction) => console.log(`Completed swipe ${direction}`),
});
```

### Deklaratif Kullanım

```tsx
<ToastRoot
  open={true}
  swipeThreshold={75}
  onSwipeStart={(direction) => console.log('Swipe started:', direction)}
  onSwipeEnd={(direction) => console.log('Swipe ended:', direction)}
>
  Swipe me in any direction!
</ToastRoot>
```

## 🧪 Test Coverage

### useSwipeGesture Hook Testleri

- ✅ Default state initialization
- ✅ Mouse gesture handling
- ✅ Touch gesture handling
- ✅ Direction calculation (4 yön)
- ✅ Threshold respect (distance & velocity)
- ✅ Swipe cancellation
- ✅ Mouse/touch enable/disable
- ✅ Velocity calculation
- ✅ Current swipe state tracking

### ToastRoot Entegrasyon Testleri

- ✅ Swipe attributes rendering
- ✅ Threshold prop handling
- ✅ Configuration passing
- ✅ State attributes during gesture
- ✅ Event handler integration

## 🚀 Demo Component

`SwipeDemo.tsx` dosyası ile canlı demo mevcut:

- Farklı variant toast'lar
- Custom threshold örnekleri
- Multiple toast test senaryoları
- Kullanım kılavuzu

## 📊 Diff Özeti

**Yeni Dosyalar:**

- `useSwipeGesture.ts` (276 satır)
- `SwipeDemo.tsx` (157 satır)
- `__tests__/useSwipeGesture.test.tsx` (333 satır)
- `__tests__/ToastRoot.swipe.test.tsx` (134 satır)

**Güncellenen Dosyalar:**

- `Toast.types.ts` (+47 satır) - Swipe tipleri eklendi
- `ToastRoot.tsx` (+45 satır) - Swipe entegrasyonu
- `toast.css` (+89 satır) - CSS animasyonları
- `index.ts` (+2 satır) - Export eklemeleri
- `jest.config.js` (+1 satır) - CSS mock desteği

**Toplam:** ~1000+ satır kod, tam TypeScript desteği, kapsamlı testler.

## ✨ Sonuç

Toast bileşenine eksiksiz swipe-to-dismiss özelliği eklendi:

- **Mouse + Touch** desteği
- **4 yönlü** swipe detection
- **Configurable threshold**
- **Smooth animations**
- **Full TypeScript** support
- **Comprehensive tests**
- **Demo component** included

Kullanıcılar artık toast'ları her yöne sürükleyerek kapatabilir, hem masaüstü hem mobil cihazlarda mükemmel kullanıcı deneyimi sağlanır.
