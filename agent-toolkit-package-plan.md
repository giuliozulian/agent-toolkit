# Project Doc — `agent-toolkit` npm package

> Documento di progetto per costruire un pacchetto npm interno che distribuisce agent Copilot/Claude (`*.agent.md`), skill (`SKILL.md`) e instructions (`*.instructions.md`) riutilizzabili in tutti i progetti, con un unico punto di aggiornamento.

## 1. Obiettivo

Evitare di duplicare a mano i sub-agent (`coordinator`, `security-reviewer`, `frontend-engineer`, `accessibility-auditor`, `performance-auditor`, `qa-test-engineer`, ecc.) e le skill di supporto in ogni repository. Un solo pacchetto versionato, un CLI che li "inietta" nel progetto corrente, un comando per aggiornarli.

Non in scope: le istruzioni project-specific (`AGENTS.md`, `CLAUDE.md`, `copilot-instructions.md`) restano nel singolo repo — il pacchetto non le tocca mai.

## 2. Decisioni da prendere prima di iniziare

| Decisione | Opzioni | Raccomandazione |
|---|---|---|
| Nome/scope pacchetto | `@<tuoscope>/agent-toolkit` | scegliere uno scope npm personale (es. `@giuliozulian/agent-toolkit`) |
| Canale di distribuzione | (a) GitHub repo privato, install via `pnpm add -D github:user/repo` · (b) npm registry pubblico (unlisted) · (c) registry privato (GitHub Packages / npm private) | **(a) GitHub privato** per partire: zero costi, zero pubblicazione pubblica accidentale di prompt/skill proprietarie, versionamento via tag/branch |
| Package manager di riferimento | pnpm (coerente con i-farm) | pnpm |
| Linguaggio CLI | TypeScript compilato vs script Node diretto | TypeScript + `tsup`/`tsc` per build, coerente con lo stack del repo principale |

## 3. Struttura del repo del pacchetto

```
agent-toolkit/
├── package.json
├── tsconfig.json
├── src/
│   ├── cli.ts              # entrypoint bin, parsing comandi
│   ├── commands/
│   │   ├── init.ts         # prima installazione in un progetto
│   │   ├── sync.ts         # aggiorna i file esistenti
│   │   └── list.ts         # elenca cosa è installato/disponibile e versioni
│   └── lib/
│       ├── copyTemplates.ts
│       ├── manifest.ts     # tiene traccia di cosa è stato installato + hash contenuto
│       └── diff.ts         # rileva modifiche locali prima di sovrascrivere
├── templates/
│   ├── agents/
│   │   ├── coordinator.agent.md
│   │   ├── security-reviewer.agent.md
│   │   ├── frontend-engineer.agent.md
│   │   ├── accessibility-auditor.agent.md
│   │   ├── performance-auditor.agent.md
│   │   └── qa-test-engineer.agent.md
│   ├── skills/
│   │   └── <nome-skill>/SKILL.md
│   └── instructions/
│       └── *.instructions.md
├── CHANGELOG.md
└── README.md
```

## 4. Comandi CLI (bin: `agent-toolkit`)

| Comando | Cosa fa |
|---|---|
| `npx agent-toolkit init` | Prima installazione: crea `.github/agents`, `.github/skills`, `.github/instructions` nel progetto corrente e copia i template selezionati (prompt interattivo o `--all`) |
| `npx agent-toolkit sync` | Confronta i file presenti con quelli del pacchetto installato; aggiorna solo quelli non modificati localmente, avvisa (diff) per quelli modificati a mano |
| `npx agent-toolkit list` | Mostra agent/skill disponibili nel pacchetto vs quelli installati nel progetto, con versione |
| `npx agent-toolkit sync --force` | Sovrascrive tutto ignorando modifiche locali (da usare consapevolmente) |

### Logica anti-sovrascrittura (manifest + hash)

Ad ogni `init`/`sync`, il CLI scrive un file `.github/agent-toolkit.lock.json` con, per ogni file installato: percorso, versione del pacchetto, hash SHA-256 del contenuto al momento della copia.

Al prossimo `sync`:
1. Se l'hash del file locale coincide con quello registrato → il file non è stato toccato manualmente → sovrascrivi con la nuova versione del template.
2. Se l'hash differisce → il progetto ha personalizzato il file → salta e segnala (`⚠ modificato localmente, sync saltato: <file>`), a meno di `--force`.

Questo evita di perdere customizzazioni project-specific fatte sopra un template condiviso.

## 5. Flusso di aggiornamento

```bash
# nel repo agent-toolkit
# 1. modifica un template in templates/agents/security-reviewer.agent.md
# 2. aggiorna CHANGELOG.md e bump versione in package.json (semver)
git commit -am "feat(security-reviewer): aggiunge check su CSRF"
git tag vX.Y.Z && git push --tags

# nel progetto consumer (es. i-farm)
pnpm update @scope/agent-toolkit   # se aggiunto come devDependency
# oppure, senza dipendenza fissa:
pnpm dlx github:tuouser/agent-toolkit#vX.Y.Z sync
```

L'output di `sync` elenca i file aggiornati, quelli saltati per modifica locale, e la versione applicata — da rivedere in un commit dedicato (`chore: sync agent-toolkit vX.Y.Z`) prima del merge, così il team vede il diff in PR.

## 6. package.json (bozza)

```jsonc
{
  "name": "@scope/agent-toolkit",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "bin": {
    "agent-toolkit": "./dist/cli.js"
  },
  "files": ["dist", "templates"],
  "scripts": {
    "build": "tsup src/cli.ts --format esm --dts",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "commander": "^12.0.0",
    "prompts": "^2.4.2",
    "picocolors": "^1.0.0"
  },
  "devDependencies": {
    "tsup": "^8.0.0",
    "typescript": "^5.5.0"
  }
}
```

## 7. Migrazione iniziale (primo set di contenuti da i-farm)

Da portare come v0.1.0 del pacchetto (contenuti generici, non project-specific):

- [ ] `.github/agents/coordinator.agent.md` (versione generica, senza riferimenti a i-farm)
- [ ] `security-reviewer`, `frontend-engineer`, `frontend-designer`, `accessibility-auditor`, `performance-auditor`, `qa-test-engineer` (se già esistono come file in questo repo, altrimenti da creare ex novo nel toolkit)
- [ ] Skill riutilizzabili identificate nelle istruzioni i-farm: `frontend-design`, `security-hardening`, `accessibility-audit`, `performance-review` (verificarne l'esistenza effettiva come `SKILL.md` prima di includerle)

Restano in i-farm (non migrano): `AGENTS.md`, `CLAUDE.md`, `.github/copilot-instructions.md` — contengono stack, path e regole specifiche del progetto, e devono solo **richiamare per nome** gli agent/skill del toolkit.

## 8. Fasi di sviluppo

1. **Bootstrap repo** — creare repo GitHub privato `agent-toolkit`, scaffolding cartelle sopra, `package.json`, `tsconfig.json`, ESLint/Prettier coerenti con lo standard usato negli altri progetti.
2. **CLI minimo** — implementare `init` (copia semplice, nessun manifest ancora) e validarlo su un progetto reale (i-farm) senza `sync`.
3. **Manifest + sync** — aggiungere `agent-toolkit.lock.json`, hashing, comando `sync` con rilevamento modifiche locali.
4. **Migrazione contenuti** — spostare/ripulire i primi agent/skill da i-farm nel toolkit, testare `init` end-to-end.
5. **Adozione multi-progetto** — installare in un secondo progetto per validare il flusso di update reale (bump versione → sync → PR).
6. **Automazione (opzionale, fase successiva)** — GitHub Action nel toolkit che valida i template (frontmatter YAML, `description` presente) ad ogni push, come minimo di CI.

## 9. Rischi e note

- **Non pubblicare su npm pubblico** contenuti che includono logiche di business o prompt proprietari: usare GitHub privato o registry privato.
- **Conflitti di merge nel consumer**: il manifest con hash mitiga sovrascritture silenziose, ma va comunque rivisto a mano l'output di `sync` prima di committare.
- **Drift tra versione toolkit e progetti**: tenere un `CHANGELOG.md` nel toolkit e citare la versione installata nel messaggio di commit di sync, per sapere sempre "chi ha quale versione".
- **Skill vs Agent**: ricordare che le skill personali (`~/.claude/skills`, `~/.agents/skills`) restano fuori da questo pacchetto — quello è un meccanismo globale via symlink, non per-progetto (vedi discussione precedente).

## 10. Prossimi passi immediati

1. Confermare nome/scope del pacchetto e canale di distribuzione (sezione 2).
2. Creare il repo `agent-toolkit` (fuori da questo workspace).
3. Scaffoldare struttura cartelle e `package.json` come da sezione 3 e 6.
4. Portare il primo agent (`coordinator`) come test end-to-end del comando `init`.
