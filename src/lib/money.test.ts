import { describe, it, expect } from 'vitest';
import { Money } from './money';

describe('Value Object: Money', () => {
  it('debe crearse correctamente a partir de centavos enteros', () => {
    const m = Money.fromCents(150000); // $1.500,00
    expect(m.cents).toBe(150000);
    expect(m.currency).toBe('ARS');
  });

  it('debe rechazar montos con decimales flotantes', () => {
    expect(() => Money.fromCents(150.5)).toThrowError();
  });

  it('debe sumar dos montos de forma exacta', () => {
    const m1 = Money.fromCents(10000); // $100,00
    const m2 = Money.fromCents(25050); // $250,50
    const total = m1.add(m2);
    expect(total.cents).toBe(35050); // $350,50
  });

  it('debe restar montos y rechazar resultados negativos', () => {
    const m1 = Money.fromCents(50000);
    const m2 = Money.fromCents(20000);
    expect(m1.subtract(m2).cents).toBe(30000);

    // En el checkout no permitimos precios negativos
    expect(() => m2.subtract(m1)).toThrowError();
  });

  it('debe multiplicar por cantidades enteras correctamente', () => {
    const unitario = Money.fromCents(120000); // $1.200,00
    const total = unitario.multiply(3);
    expect(total.cents).toBe(360000); // $3.600,00
  });

  it('debe formatear en pesos argentinos (es-AR)', () => {
    const m = Money.fromCents(125050); // $1.250,50
    const formatted = m.format();
    // Verifica formato de moneda argentino con separador de miles y coma decimal
    expect(formatted).toContain('1.250,50');
  });
});
