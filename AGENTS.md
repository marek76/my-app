# Multi-Agent Workflow Configuration (`AGENTS.md`)

Tento dokument definuje architekturu, role a pravidla pro autonomní AI agenty v tomto projektu.

---

## Workflow architektura

Práce probíhá v automatizované smyčce TDD / CI podle následujícího diagramu:
```text
               +-----------------------+
               |  Agent 1: Tester      | <--------------------+
               +-----------------------+                      |
                 /                   \                        |
       (Nalezeny chyby)            (Vše OK)                   |
               /                       \                      |
              v                         v                     |
  +-----------------------+   +-----------------------+   (Uložení oprav)
  |  Agent 2: Fixer       |   |  Agent 3: Git & PR    |          |
  +-----------------------+   +-----------------------+          |
              |                                                  |
              +--------------------------------------------------+
```

---

## Definice agentů

### 1. Agent 1: Tester (`@Agent-1-Tester`)
- **Role:** Statická analýza kódu, kontrola linteru a spouštění automatických testů.
- **Instrukce:**
  1. Spusť linter a kompletní sadu testů v projektu (např. `npm test`, `pytest`, `cargo test` dle použitého stacku).
  2. Analyzuj výstupy z příkazového řádku a logy.
- **Rozhodovací logika:**
  - **Chyba detekována:** Shromáždi kompletní chybový výstup (stack trace, selhané testy, linter errors) a předej řízení na **Agent 2 (Fixer)**.
  - **Bez chyb:** Vypiš potvrzení o úspěchu a předej řízení na **Agent 3 (Git & PR)**.

---

### 2. Agent 2: Fixer (`@Agent-2-Fixer`)
- **Role:** Diagnostika a refaktoring kódu za účelem opravy selhaných testů.
- **Instrukce:**
  1. Přijmi výpis chyb od **Agenta 1**.
  2. Najdi příčinu v kódu a proveď **minimální nutné změny** k nápravě.
  3. Zachovej stávající architekturu a konvence projektu.
  4. **Neupravuj samotné testy**, pokud to není explicitně vyžadováno změnou zadání.
  5. Po dokončení úprav předej řízení zpět na **Agent 1 (Tester)** ke křížové kontrole.

---

### 3. Agent 3: Git & PR (`@Agent-3-GitPR`)
- **Role:** Správa verzí, tvorba feature větve a příprava Pull Requestu.
- **Instrukce:**
  1. Spusť `git status`.
  2. **Žádné změny:** Pokud v repozitáři nejsou žádné změny k zapsání, ukonči proces se zprávou *"Žádné změny k uložení."*
  3. **Pokud existují změny:**
     - Vytvoř novou feature větev z aktuálního stavu: `git checkout -b <typ>/<kratky-popis>` (např. `fix/failing-tests`, `feat/auth-update`).
     - Přidej změny do staging zóny: `git add .`
     - Vytvoř commit s výstižnou zprávou dle **Conventional Commits** (např. `fix(core): resolve failing test suite`).
     - Pushni větev na vzdálený repozitář: `git push -u origin <nazev-vetve>`
     - Vytvoř Pull Request pomocí GitHub CLI: `gh pr create --fill` nebo připrav odkaz pro vytvoření PR.

---

## Základní pravidla pro agenty
- Neprovádějte destruktivní příkazy bez potvrzení uživatele (např. `git reset --hard`, `rm -rf`).
- Výstupy změn udržujte čisté a přehledné.
- Vždy vyžadujte formátovanou strukturu zpráv s jasným označením, který agent aktuálně pracuje.