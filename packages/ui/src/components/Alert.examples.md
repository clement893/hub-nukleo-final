# Alert Components Examples

## Basic Usage

### SuccessAlert
```tsx
import { SuccessAlert } from "@nukleo/ui";

// Avec les messages par défaut
<SuccessAlert />

// Avec des messages personnalisés
<SuccessAlert 
  title="Opération réussie" 
  description="Votre demande a été traitée avec succès."
/>
```

### WarningAlert
```tsx
import { WarningAlert } from "@nukleo/ui";

// Avec les messages par défaut
<WarningAlert />

// Avec des messages personnalisés
<WarningAlert 
  title="Attention" 
  description="Veuillez vérifier ces informations avant de continuer."
/>
```

### ErrorAlert
```tsx
import { ErrorAlert } from "@nukleo/ui";

// Avec les messages par défaut
<ErrorAlert />

// Avec des messages personnalisés
<ErrorAlert 
  title="Erreur" 
  description="Une erreur s'est produite. Veuillez réessayer."
/>
```

### InfoAlert
```tsx
import { InfoAlert } from "@nukleo/ui";

<InfoAlert 
  title="Information" 
  description="Voici une information importante."
/>
```

## Advanced Usage

### Alert avec contenu personnalisé
```tsx
import { Alert, AlertTitle, AlertDescription } from "@nukleo/ui";

<Alert variant="success" showIcon>
  <AlertTitle>Succès</AlertTitle>
  <AlertDescription>
    Votre action a été complétée avec succès.
  </AlertDescription>
  <div className="mt-2">
    <button>Action supplémentaire</button>
  </div>
</Alert>
```

### Alert sans icône
```tsx
import { SuccessAlert } from "@nukleo/ui";

<SuccessAlert showIcon={false} />
```

