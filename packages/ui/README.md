# @nukleo/ui

Bibliothèque de composants UI réutilisables pour les applications Nukleo, construite avec React, TypeScript et Tailwind CSS.

## Installation

```bash
pnpm add @nukleo/ui
```

## Configuration

Assurez-vous que Tailwind CSS est configuré dans votre projet et que les classes utilisées par les composants sont disponibles.

## Composants

### Button

Bouton avec plusieurs variantes et tailles.

```tsx
import { Button } from "@nukleo/ui";

// Variantes
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="danger">Danger</Button>
<Button variant="link">Link</Button>

// Tailles
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
<Button size="icon">🔍</Button>

// États
<Button loading>Loading</Button>
<Button disabled>Disabled</Button>
<Button leftIcon={<Icon />}>With Icon</Button>
```

### Card

Carte avec header, content et footer.

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@nukleo/ui";

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

### Input

Champ de saisie avec label, erreur et helper text.

```tsx
import { Input } from "@nukleo/ui";

<Input
  label="Email"
  type="email"
  placeholder="Enter your email"
  required
  error="Invalid email"
  helperText="We'll never share your email"
  leftIcon={<MailIcon />}
/>
```

### Textarea

Zone de texte avec compteur de caractères.

```tsx
import { Textarea } from "@nukleo/ui";

<Textarea
  label="Message"
  placeholder="Enter your message"
  maxLength={500}
  showCharacterCount
  autoResize
/>
```

### Select

Sélecteur avec options.

```tsx
import { Select } from "@nukleo/ui";

<Select
  label="Country"
  placeholder="Select a country"
  options={[
    { value: "fr", label: "France" },
    { value: "us", label: "United States" },
  ]}
/>
```

### Checkbox

Case à cocher avec état indéterminé.

```tsx
import { Checkbox } from "@nukleo/ui";

<Checkbox
  label="Accept terms and conditions"
  checked={checked}
  onChange={(e) => setChecked(e.target.checked)}
/>
```

### Radio

Boutons radio avec groupe.

```tsx
import { RadioGroup, Radio } from "@nukleo/ui";

<RadioGroup value={value} onChange={setValue} orientation="vertical">
  <Radio value="option1" label="Option 1" />
  <Radio value="option2" label="Option 2" />
  <Radio value="option3" label="Option 3" />
</RadioGroup>
```

### Switch

Interrupteur on/off.

```tsx
import { Switch } from "@nukleo/ui";

<Switch
  label="Enable notifications"
  checked={enabled}
  onChange={(e) => setEnabled(e.target.checked)}
  size="md"
/>
```

### Modal

Modal avec overlay et fermeture.

```tsx
import { Modal } from "@nukleo/ui";

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Modal Title"
  size="md"
  footer={
    <>
      <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
      <Button onClick={handleSubmit}>Confirm</Button>
    </>
  }
>
  <p>Modal content</p>
</Modal>
```

### Loader

Indicateur de chargement.

```tsx
import { Loader } from "@nukleo/ui";

<Loader size="md" variant="primary" text="Loading..." />
```

### Skeleton

Placeholder de chargement.

```tsx
import { Skeleton } from "@nukleo/ui";

<Skeleton variant="text" width="100%" />
<Skeleton variant="circle" width={40} height={40} />
<Skeleton variant="rectangle" width="100%" height={200} />
```

### Alert

Alerte avec variantes.

```tsx
import { Alert, AlertTitle, AlertDescription } from "@nukleo/ui";

<Alert variant="success">
  <AlertTitle>Success</AlertTitle>
  <AlertDescription>Operation completed successfully.</AlertDescription>
</Alert>
```

### Badge

Badge avec variantes et tailles.

```tsx
import { Badge } from "@nukleo/ui";

<Badge variant="primary" size="md">New</Badge>
<Badge variant="success">Active</Badge>
<Badge variant="error">Error</Badge>
```

### Progress

Barre de progression.

```tsx
import { Progress } from "@nukleo/ui";

<Progress value={75} max={100} showPercentage variant="primary" />
```

### Toast

Notification toast.

```tsx
import { Toast } from "@nukleo/ui";

<Toast
  variant="success"
  title="Success"
  description="Your changes have been saved."
  onClose={() => {}}
/>
```

### Tabs

Onglets avec contenu.

```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@nukleo/ui";

<Tabs value={activeTab} onValueChange={setActiveTab}>
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">Content 1</TabsContent>
  <TabsContent value="tab2">Content 2</TabsContent>
</Tabs>
```

### Accordion

Accordéon pliable.

```tsx
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@nukleo/ui";

<Accordion type="single" value={value} onValueChange={setValue}>
  <AccordionItem value="item1">
    <AccordionTrigger>Is it accessible?</AccordionTrigger>
    <AccordionContent>Yes. It adheres to the WAI-ARIA design pattern.</AccordionContent>
  </AccordionItem>
</Accordion>
```

### Breadcrumb

Fil d'Ariane.

```tsx
import { Breadcrumb } from "@nukleo/ui";

<Breadcrumb
  items={[
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
    { label: "Current Page" },
  ]}
/>
```

### Pagination

Pagination avec navigation.

```tsx
import { Pagination } from "@nukleo/ui";

<Pagination
  currentPage={currentPage}
  totalPages={10}
  onPageChange={setCurrentPage}
  showFirstLast
  pageSize={20}
  onPageSizeChange={setPageSize}
/>
```

### Tooltip

Info-bulle.

```tsx
import { Tooltip } from "@nukleo/ui";

<Tooltip content="This is a tooltip" position="top" delay={200}>
  <Button>Hover me</Button>
</Tooltip>
```

### Avatar

Avatar avec image et fallback.

```tsx
import { Avatar } from "@nukleo/ui";

<Avatar
  src="/avatar.jpg"
  alt="User avatar"
  fallback="John Doe"
  size="md"
  status="online"
/>
```

### Dropdown

Menu déroulant.

```tsx
import {
  DropdownMenu,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
  DropdownSeparator,
} from "@nukleo/ui";

<DropdownMenu>
  <DropdownTrigger>
    <Button>Open Menu</Button>
  </DropdownTrigger>
  <DropdownContent>
    <DropdownItem>Profile</DropdownItem>
    <DropdownItem>Settings</DropdownItem>
    <DropdownSeparator />
    <DropdownItem>Logout</DropdownItem>
  </DropdownContent>
</DropdownMenu>
```

### Table

Tableau avec tri.

```tsx
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableSortableHead,
} from "@nukleo/ui";

<Table>
  <TableHeader>
    <TableRow>
      <TableSortableHead sortable sortDirection="asc" onSort={() => {}}>
        Name
      </TableSortableHead>
      <TableHead>Email</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>John Doe</TableCell>
      <TableCell>john@example.com</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

### DatePicker

Sélecteur de date.

```tsx
import { DatePicker } from "@nukleo/ui";

<DatePicker
  label="Select date"
  minDate="2024-01-01"
  maxDate="2024-12-31"
  mode="single"
/>
```

## Utilitaires

### cn()

Fonction utilitaire pour combiner les classes Tailwind CSS.

```tsx
import { cn } from "@nukleo/ui";

<div className={cn("base-class", condition && "conditional-class")} />
```

## Développement

```bash
# Linter
pnpm lint

# Type check
pnpm type-check

# Build
pnpm build
```

## Licence

MIT


