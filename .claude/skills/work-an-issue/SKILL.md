---
name: work-an-issue
description: Work a ready issue from the customer's issues repo end to end through the agentic-studio MCP tools, from picking it up to a pull request in review. Use when asked to take, start or work an issue or the next piece of work.
---

# Work an issue

This repo is the code. The customer's issues live in their issues repo on GitHub, and you reach them through Agentic
Studio's MCP tools (`agentic-studio`; the address and the command to add it are under Agenter in Studio). Use those tools
for the issue itself. The code and the pull request go through git and `gh` as usual.

## Steps

1. **Pick.** Take the issue you were given. Without one, `list_issues` and look for open issues labelled
   `ready-for-agent` that nobody is assigned. Several fit: ask which.
2. **Read.** `get_issue` for the text, the comments, the labels and the parent initiative. Read every comment: answers
   to earlier questions are there. If it names a meeting (`meetings/<id>`), `get_meeting` gives its summary and
   minutes. If a requirement is unclear, go to "When something is unclear" before writing code.
3. **Start.** `start_work` assigns the issue to you. If it refuses, say why and do not work around it.
4. **Build.** Test first, one small slice at a time. Follow `docs/engineering/patterns.md`. Run the checks in
   `docs/getting-started.md` (`bun run test`, `bun run lint`, `bun run check`, `bun run build`) before the pull request.
5. **Open the pull request** with the issue in the title, and `Closes <owner>/<issues repo>#<number>` in the body, so
   merging it closes the issue. Then `link_pull_request` with its web address.
6. **Say how to try it.** `comment` on the issue with a short "## How to test" section: the steps in the running app
   and what should be seen, in plain words, not the code's.

## When something is unclear

`comment` on the issue with one focused question, and what you would do if the answer is "no preference". Then
`update_issue` to give it the label `needs-info` in place of its other state label, and tell the person you work for.
Carry on with work that does not depend on the answer; do not guess the rest.

## What you never do

- Close, reopen or delete an issue or an initiative. Merging the pull request closes the issue.
- Add or remove `official`. It decides what the customer sees, and a person on the team sets it.
- Copy anything from a meeting's transcript into an issue.

Spell names and terms the way the customer does: `list_people_and_terms` lists them.
