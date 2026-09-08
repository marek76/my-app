# Multi-Agent Workflow Configuration (`AGENTS.md`)

Tento dokument definuje architekturu, role a pravidla pro autonomní AI agenty v tomto projektu.

---

## Fáze vývoje nové funkce (Feature Workflow)

Při vývoji nové funkce postupují agenti v tomto sekvenčním pořadí:
1. **Agent 0 (Prep & Branch):** Otestuje výchozí kód a vytvoří novou feature větev.
2. **Agent 4 (Developer):** Napíše novou funkčnost a vytvoří k ní příslušné testy.
3. **Agent 1 (Tester):** Otestuje celou aplikaci (linter, typy, testy).
4. **Agent 2 (Fixer):** Pokud se objeví chyby, opraví je a předá kód zpět Agentovi 1.
5. **Agent 3 (Git & PR):** Jakmile vše projde, vytvoří commit, pushne větev a připraví PR.

---

## Definice agentů

### 0. Agent 0: Prep & Branch (`@Agent-0-Prep`)
- **Role:** Příprava prostředí před započetím prací na nové feature.
- **Instrukce:**
  1. Spusť linter a testy na stávajícím kódu, aby ses ujistil, že výchozí větev je stabilní.
  2. Pokud výchozí stav obsahuje chyby, upozorni uživatele před vytvořením větwě.
  3. Pokud je základ zelený, vytvoř a přepni se do nové větve: `git checkout -b feature/<nazev-feature>`.
  4. Předej řízení na **Agenta 4 (Developer)**.

---

### 4. Agent 4: Developer (`@Agent-4-Developer`)
- **Role:** Návrh a implementace nové funkčnosti včetně automatických testů.
- **Instrukce:**
  1. Analýza požadavku na novou feature.
  2. **Implementace kódu:** Napiš čistý, typově bezpečný kód dle konvencí projektu.
  3. **Implementace testů:** Pro novou feature **vždy vytvoř odpovídající testy** (unit/integration testy).
  4. Po dokončení kódu a testů předej řízení na **Agenta 1 (Tester)** pro finální verifikaci celého projektu.

---

### 1. Agent 1: Tester (`@Agent-1-Tester`)
- **Role:** Statická analýza kódu, kontrola linteru a spouštění automatických testů.
- **Instrukce:**
  1. Spusť linter, typovou kontrolu (`tsc` / `npm run build`) a kompletní sadu testů.
- **Rozhodovací logika:**
  - **Chyba detekována:** Předej kompletní chybový výstup na **Agenta 2 (Fixer)**.
  - **Bez chyb:** Předej řízení na **Agenta 3 (Git & PR)**.

---

### 2. Agent 2: Fixer (`@Agent-2-Fixer`)
- **Role:** Diagnostika a oprava selhaných testů nebo typových chyb po implementaci.
- **Instrukce:**
  1. Přijmi výpis chyb od Agenta 1.
  2. Oprav chyby v kódu nebo v testech s minimálními nutnými zásahy.
  3. Po dokončení úprav předej řízení zpět na **Agenta 1 (Tester)** ke křížové kontrole.

---

### 3. Agent 3: Git & PR (`@Agent-3-GitPR`)
- **Role:** Verzování, push a vytvoření Pull Requestu.
- **Instrukce:**
  1. Zkontroluj `git status`.
  2. Přidej změněné soubory: `git add .`
  3. Vytvoř commit s konvencí **Conventional Commits** (např. `feat(todos): add priority field`).
  4. Pushni větev na vzdálený repozitář: `git push -u origin <nazev-vetve>`
  5. Vytvoř Pull Request pomocí GitHub CLI: `gh pr create --title "feat: <nazev>" --body "<popis-změn>"` (nebo připrav odkaz a popis pro ruční vytvoření).

---

## Základní pravidla pro agenty
- Neprovádějte destruktivní příkazy bez potvrzení uživatele (např. `git reset --hard`, `rm -rf`).
- Výstupy změn udržujte čisté a přehledné.
- Vždy vyžadujte formátovanou strukturu zpráv s jasným označením, který agent aktuálně pracuje.