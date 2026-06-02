import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { InfoPanel } from '../src/components/InfoPanel';
import { CartProvider } from '../src/context/CartContext';
import React, { useState } from 'react';

const mockProduct = {
  id: 1,
  title: 'Apex Ranger 35L Multi-Day Pack',
  brand: 'SUMMIT // WILDERNESS',
  price: 109.95,
  originalPrice: 148.43,
  onSale: true,
  rating: { rate: 4.5, count: 48 },
  description: 'Test description',
  specifications: [{ key: 'Capacity', value: '35 Liters' }],
  colors: [
    { id: 'alpine-green', name: 'Alpine Green', hex: '#1e3a2f' },
    { id: 'slate-grey', name: 'Slate Grey', hex: '#4b5563' }
  ],
  sizes: [
    { size: 'S', stock: 15 },
    { size: 'M', stock: 2 },
    { size: 'L', stock: 0 }
  ],
  images: ['https://example.com/image.png'],
  reviews: [],
  category: 'Technical Packs'
};

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <CartProvider>{children}</CartProvider>;
};

describe('InfoPanel - Variant Selector Tests', () => {
  it('correctly disables and marks sold-out sizes', () => {
    let selectedColorId = 'alpine-green';
    let selectedSize = 'S';

    render(
      <Wrapper>
        <InfoPanel
          product={mockProduct}
          selectedColorId={selectedColorId}
          setSelectedColorId={(id) => { selectedColorId = id; }}
          selectedSize={selectedSize}
          setSelectedSize={(sz) => { selectedSize = sz; }}
        />
      </Wrapper>
    );

    const sizeLButton = screen.getByRole('radio', { name: /Select size L\. Sold out/i });
    expect(sizeLButton).toBeDisabled();
    expect(sizeLButton).toHaveClass(/soldOutSize/);
  });

  it('disables the Add to Cart CTA button when selected variant is sold out', () => {
    const selectedColorId = 'alpine-green';
    const selectedSize = 'L';

    render(
      <Wrapper>
        <InfoPanel
          product={mockProduct}
          selectedColorId={selectedColorId}
          setSelectedColorId={() => {}}
          selectedSize={selectedSize}
          setSelectedSize={() => {}}
        />
      </Wrapper>
    );

    const ctaButton = screen.getByRole('button', { name: /Sold Out/i });
    expect(ctaButton).toBeDisabled();
  });

  it('caps the quantity picker to available stock for low-stock variants', () => {
    const TestComponent = () => {
      const [colorId, setColorId] = useState('alpine-green');
      const [size, setSize] = useState('S');

      return (
        <Wrapper>
          <InfoPanel
            product={mockProduct}
            selectedColorId={colorId}
            setSelectedColorId={setColorId}
            selectedSize={size}
            setSelectedSize={setSize}
          />
        </Wrapper>
      );
    };

    render(<TestComponent />);

    const sizeMButton = screen.getByRole('radio', { name: /Select size M\. Low stock/i });
    fireEvent.click(sizeMButton);

    const qtyInput = screen.getByRole('spinbutton', { name: /Product quantity input/i }) as HTMLInputElement;
    expect(qtyInput.max).toBe('2');

    const plusButton = screen.getByRole('button', { name: /Increase quantity/i });
    
    fireEvent.click(plusButton);
    expect(qtyInput.value).toBe('2');
    
    expect(plusButton).toBeDisabled();
  });
});
