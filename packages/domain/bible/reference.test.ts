import { describe, it, expect } from "vitest";
import { formatReference } from "./reference";

describe("formatReference", () => {
  it("deve formatar referência com versículo específico usando abreviação", () => {
    expect(formatReference("jo", 3, 16)).toBe("João 3:16");
    expect(formatReference("gn", 1, 1)).toBe("Gênesis 1:1");
    expect(formatReference("sl", 23, 1)).toBe("Salmos 23:1");
  });

  it("deve formatar referência de capítulo inteiro sem versículo", () => {
    expect(formatReference("jo", 3)).toBe("João 3");
    expect(formatReference("rm", 8)).toBe("Romanos 8");
    expect(formatReference("sl", 119)).toBe("Salmos 119");
  });

  it("deve aceitar nome completo do livro diretamente", () => {
    expect(formatReference("João", 3, 16)).toBe("João 3:16");
    expect(formatReference("Salmos", 23)).toBe("Salmos 23");
    expect(formatReference("1 Coríntios", 13, 4)).toBe("1 Coríntios 13:4");
  });

  it("deve tratar espaçamento e capitalização de abreviações", () => {
    expect(formatReference("  MT  ", 5, 3)).toBe("Mateus 5:3");
    expect(formatReference("1sm", 2, 1)).toBe("1 Samuel 2:1");
  });
});
