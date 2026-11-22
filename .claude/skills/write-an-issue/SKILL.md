---
name: write-an-issue
description: Write a new issue or initiative in the customer's issues repo through the agentic-studio MCP tools. Use when asked to file, create or write up an issue, bug, idea or initiative.
---

# Write an issue

The customer's issues repo has a `way-of-working.md`: how initiatives, issues and labels work there. Follow it; this
skill is the short version.

## Before you create

1. `list_issues` and look for the same thing. If it exists, `comment` on it instead.
2. Spell people and terms as the customer does: `list_people_and_terms`.

## An initiative or an issue

- **An initiative** is something the business wants. `create_initiative` with a title and a description of what should
  become true, who asked and why it matters, in plain words and with no acceptance criteria. It starts internal: the
  customer sees it only once a person on the team adds `official`, and you never do.
- **An issue** is a task that can be finished on its own. `create_issue`, under its initiative when it has one.

## The issue

- **title**: short, what is wanted, not how. "Customers can pay by invoice", not "Add InvoiceController".
- **body** in markdown:
  - What should be true when it is done, in plain sentences.
  - Acceptance criteria, one per line, each something a person can check.
  - What is left out, if the scope could be misread.
- **labels**: exactly one state label from `way-of-working.md` (`ready-for-agent` when an agent can do it without more
  context). From a meeting: the label `source:meeting`, and the meeting's folder, `meetings/<id>`, in the body.

Plain human sentences: comma, period, parentheses or hyphen. No em-dash, no filler.

## After

You do not close, reopen or delete an issue or an initiative, and you do not add or remove `official`. To work the
issue, see the `work-an-issue` skill.
