/**
 * Value Object inmutable para representar dinero en BX Boutique.
 * Garantiza que nunca existan operaciones con números de punto flotante.
 */
export class Money {
  readonly cents: number;
  readonly currency: 'ARS';

  private constructor(cents: number) {
    if (!Number.isInteger(cents)) {
      throw new Error(`Los centavos deben ser un número entero. Recibido: ${cents}`);
    }
    if (cents < 0) {
      throw new Error(`El monto no puede ser negativo. Recibido: ${cents}`);
    }
    this.cents = cents;
    this.currency = 'ARS';
  }

  /**
   * Crea una instancia a partir de un entero en centavos.
   * Ej: $1.250,00 -> Money.fromCents(125000)
   */
  static fromCents(cents: number): Money {
    return new Money(cents);
  }

  /**
   * Crea una instancia de $0 ARS.
   */
  static zero(): Money {
    return new Money(0);
  }

  add(other: Money): Money {
    return new Money(this.cents + other.cents);
  }

  subtract(other: Money): Money {
    if (this.cents < other.cents) {
      throw new Error(`Resultado negativo no permitido: ${this.cents} - ${other.cents}`);
    }
    return new Money(this.cents - other.cents);
  }

  multiply(quantity: number): Money {
    if (!Number.isInteger(quantity) || quantity < 0) {
      throw new Error(`La cantidad debe ser un entero no negativo: ${quantity}`);
    }
    return new Money(this.cents * quantity);
  }

  /**
   * Formato estricto para Argentina: $ 1.250,50
   */
  format(): string {
    const amountInPesos = this.cents / 100;
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 2,
    }).format(amountInPesos);
  }
}
