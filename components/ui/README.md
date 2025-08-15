# Composants UI - Page "Nos Ouvrages"

Cette page utilise des composants modulaires modernes basés sur **shadcn/ui**, **Tailwind CSS** et **Framer Motion**, avec des icônes exclusivement de **Lucide.dev**.

## 🎯 Composants Principaux

### 1. **BookCard** (`book-card.tsx`)
Carte moderne pour afficher un ouvrage avec :
- **Image avec zoom au survol** (effet `group-hover:scale-105`)
- **Badge "NOUVEAU"** pour les livres récents
- **Note en étoiles** dynamique (1-5 étoiles)
- **Informations complètes** : pays, année, collection, description
- **Statistiques** : vues, téléchargements
- **Boutons d'action** : Consulter + Favoris
- **Animations Framer Motion** : `whileHover={{ scale: 1.03 }}`

### 2. **BooksGrid** (`books-grid.tsx`)
Grille responsive pour afficher tous les ouvrages :
- **Layout responsive** : 1 → 2 → 3 → 4 colonnes
- **Animations d'apparition** avec délai progressif
- **Gestion des cas vides** avec message et icône
- **Intégration avec BookCard**

### 3. **SearchFilters** (`search-filters.tsx`)
Interface de recherche et filtrage moderne :
- **Barre de recherche** avec icône Search
- **Filtres par pays** avec icônes Globe/MapPin
- **Filtres par niveau** avec icônes GraduationCap/BookOpen/Users
- **Filtres par série** avec icônes spécialisées
- **Filtres avancés** extensibles
- **Bouton de réinitialisation** avec icône RefreshCw

### 4. **ResultsStats** (`results-stats.tsx`)
Affichage des statistiques de recherche :
- **Compteur d'ouvrages** trouvés
- **Filtres actifs** avec badges colorés
- **Design moderne** avec fond semi-transparent

### 5. **Pagination** (`pagination.tsx`)
Navigation entre les pages :
- **Boutons Précédent/Suivant** avec icônes ChevronLeft/ChevronRight
- **Numéros de page** avec gestion des ellipses
- **État actif** pour la page courante
- **Animations d'apparition**

### 6. **PageHeader** (`page-header.tsx`)
En-tête de page avec navigation :
- **Logo LAHA** avec lien vers l'accueil
- **Navigation desktop** responsive
- **Menu mobile** avec animation
- **Indicateur de page active**

### 7. **PageFooter** (`page-footer.tsx`)
Pied de page moderne :
- **Animation d'apparition** au scroll
- **Design cohérent** avec le thème

### 8. **HeroSection** (`hero-section.tsx`)
Section d'en-tête de page :
- **Titre animé** avec BlurText
- **Description** responsive
- **Animations d'entrée**

## 🎨 Icônes Lucide.dev Utilisées

### **Navigation & Actions**
- `Menu`, `X` - Menu mobile
- `Search` - Barre de recherche
- `Filter` - Filtres
- `RefreshCw` - Réinitialiser

### **Filtres**
- `Globe` - Tous les pays
- `MapPin` - Pays individuels
- `GraduationCap` - Niveaux d'éducation
- `BookOpen` - Primaire
- `Users` - Supérieur

### **Séries**
- `BookMarked` - J'apprends en SVT
- `Brain` - Philosophie
- `Trophy` - Réussir en
- `Target` - Préparation aux examens
- `Languages` - Communication écrite
- `Zap` - Sports traditionnels

### **Cartes de livres**
- `Star` - Notes
- `Eye` - Vues
- `BookOpen` - Téléchargements
- `Heart` - Favoris
- `MapPin` - Localisation
- `Calendar` - Année

### **Pagination**
- `ChevronLeft`, `ChevronRight` - Navigation
- `MoreHorizontal` - Ellipses

## 🚀 Fonctionnalités

### **Recherche & Filtrage**
- Recherche textuelle en temps réel
- Filtrage par pays (15 pays africains)
- Filtrage par niveau (Primaire, Secondaire, Supérieur)
- Filtrage par série (7 collections)
- Filtres avancés extensibles

### **Pagination**
- 12 ouvrages par page
- Navigation intuitive
- Réinitialisation automatique lors du changement de filtres

### **Responsive Design**
- Mobile-first approach
- Grille adaptative
- Menu mobile avec animations

### **Animations**
- **Framer Motion** pour toutes les interactions
- **Transitions fluides** sur les cartes
- **Animations d'apparition** progressives
- **Effets de survol** élégants

## 🎯 Utilisation

```tsx
// Exemple d'utilisation complète
<PageHeader currentPage="nos-ouvrages" />

<HeroSection 
  title="Nos Ouvrages"
  description="Description de la collection..."
/>

<SearchFilters 
  searchQuery={searchQuery}
  setSearchQuery={setSearchQuery}
  // ... autres props
/>

<ResultsStats 
  count={filteredBooks.length}
  // ... autres props
/>

<BooksGrid books={paginatedBooks} />

<Pagination 
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={setCurrentPage}
/>

<PageFooter />
```

## 🔧 Personnalisation

Tous les composants utilisent les **variables CSS personnalisées** de LAHA :
- `--laha-black` : Couleur de fond principale
- `--laha-gold` : Couleur d'accentuation
- `--laha-gold-dark` : Couleur d'accentuation sombre
- `--laha-gold-light` : Couleur d'accentuation claire

## 📱 Responsive Breakpoints

- **Mobile** : `< 768px` - 1 colonne
- **Tablet** : `≥ 768px` - 2 colonnes  
- **Desktop** : `≥ 1024px` - 3 colonnes
- **Large** : `≥ 1280px` - 4 colonnes
