// ESC/POS command builder for thermal printers

export const ESC = 0x1b;
export const GS = 0x1d;
export const LF = 0x0a;

export class EscPos {
  private buffer: number[] = [];

  /** Inicializa la impresora */
  init(): this {
    this.buffer.push(ESC, 0x40);
    return this;
  }

  /** Salto de línea */
  feed(lines = 1): this {
    for (let i = 0; i < lines; i++) this.buffer.push(LF);
    return this;
  }

  /** Texto plano */
  text(str: string): this {
    // Basic conversion to handle some Spanish chars if needed, but keeping it simple
    for (const char of str) {
      // replace ñ with n for simple ASCII thermal printing to avoid weird characters
      let c = char.charCodeAt(0);
      if (char === 'ñ') c = 'n'.charCodeAt(0);
      if (char === 'Ñ') c = 'N'.charCodeAt(0);
      if (c > 255) c = '?'.charCodeAt(0);
      this.buffer.push(c);
    }
    return this;
  }

  /** Texto + salto de línea */
  println(str: string): this {
    return this.text(str).feed();
  }

  /** Negrita ON/OFF */
  bold(on: boolean): this {
    this.buffer.push(ESC, 0x45, on ? 1 : 0);
    return this;
  }

  /** Tamaño de fuente: normal | large | xl */
  fontSize(size: "normal" | "large" | "xl"): this {
    const val = size === "xl" ? 0x11 : size === "large" ? 0x01 : 0x00;
    this.buffer.push(GS, 0x21, val);
    return this;
  }

  /**
   * Tamaño de fuente personalizado
   * @param width Multiplicador de ancho (1 al 8)
   * @param height Multiplicador de alto (1 al 8)
   */
  size(width: number, height: number): this {
    const w = Math.max(1, Math.min(8, width)) - 1;
    const h = Math.max(1, Math.min(8, height)) - 1;
    const val = (w * 16) + h;
    this.buffer.push(GS, 0x21, val);
    return this;
  }

  /** Alineación: left | center | right */
  align(align: "left" | "center" | "right"): this {
    const val = align === "center" ? 1 : align === "right" ? 2 : 0;
    this.buffer.push(ESC, 0x61, val);
    return this;
  }

  /** Separador punteado */
  separator(): this {
    return this.println("-".repeat(32));
  }

  /** Configura altura del código de barras (1-255) */
  barcodeHeight(dots = 60): this {
    this.buffer.push(GS, 0x68, dots);
    return this;
  }

  /** Posición del texto del código de barras (HRI) */
  barcodeHRI(pos: 0 | 1 | 2 | 3 = 2): this {
    // 0: No imprimir, 1: Arriba, 2: Abajo, 3: Ambos
    this.buffer.push(GS, 0x48, pos);
    return this;
  }

  /** Imprime código de barras */
  barcode(data: string, type: "EAN13" | "CODE128" = "CODE128"): this {
    if (type === "CODE128") {
      this.buffer.push(GS, 0x6b, 0x49, data.length);
      for (let i = 0; i < data.length; i++) {
        this.buffer.push(data.charCodeAt(i));
      }
    } else {
      // EAN13
      this.buffer.push(GS, 0x6b, 0x43, data.length);
      for (let i = 0; i < data.length; i++) {
        this.buffer.push(data.charCodeAt(i));
      }
    }
    return this;
  }

  /** Corte de papel */
  cut(): this {
    this.buffer.push(GS, 0x56, 0x41, 0x03);
    return this;
  }

  /** Devuelve el buffer listo para enviarse */
  build(): Uint8Array {
    return new Uint8Array(this.buffer);
  }
}
