"use client"

import { ChevronsUpDown } from "lucide-react"

import { CLIENTS, type ClientKey } from "@/app/lab/portfolio-report/clients"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

/**
 * Which client's report is on screen, and how to change it.
 *
 * Deliberately the plainest thing on the page: this is the reading device's control, not
 * part of the document. So no avatar, no card, no accent — a hairline surface, the name,
 * and enough context to know whose report this is. Positioning belongs to the control
 * cluster in ReportViewer, which it shares with the theme toggle.
 *
 * It is a menu rather than tabs because two clients' reports are two documents, not two
 * views of one thing, and tabs across the top would promise the latter.
 */

function ClientSwitcher({
  active,
  onChange,
}: {
  active: ClientKey
  onChange: (key: ClientKey) => void
}) {
  const current = CLIENTS.find((client) => client.key === active)!

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="flex items-center gap-3 rounded-md border bg-background/90 py-2 pr-2.5 pl-3.5 text-left shadow-xs backdrop-blur-sm transition-colors hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
        aria-label="Change client"
      >
        <span className="min-w-0">
          <span className="block text-[0.5625rem] font-medium tracking-[0.12em] text-muted-foreground uppercase">
            Reading
          </span>
          <span className="block truncate text-[0.8125rem] font-medium">
            {current.name}
          </span>
        </span>
        <ChevronsUpDown
          aria-hidden
          className="size-3.5 shrink-0 text-muted-foreground"
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        side="top"
        align="end"
        sideOffset={8}
        className="w-[19rem]"
      >
        <DropdownMenuRadioGroup
          value={active}
          onValueChange={(value) => onChange(value as ClientKey)}
        >
          {/* Base UI requires GroupLabel to live inside the group it names. */}
          <DropdownMenuLabel className="text-[0.5625rem] font-medium tracking-[0.12em] text-muted-foreground uppercase">
            Client reports
          </DropdownMenuLabel>
          {CLIENTS.map((client) => (
            <DropdownMenuRadioItem
              key={client.key}
              value={client.key}
              // Base UI keeps radio items open on click; picking a report should dismiss.
              closeOnClick
              className="items-start py-2"
            >
              <span className="min-w-0">
                <span className="block text-[0.8125rem] font-medium">
                  {client.name}
                </span>
                <span className="mt-0.5 block text-xs text-muted-foreground">
                  {client.subject}
                </span>
                <span className="mt-1 block font-mono text-[0.625rem] text-muted-foreground tabular-nums">
                  {client.currency} · as at {client.asOf}
                </span>
              </span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export { ClientSwitcher }
