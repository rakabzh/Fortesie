# Fortesie

Ce script utilise l'API FORTESIE pour récupérer les datas du Price Comfort

## Prérequis

- Node.js
- npm
- avoir un token de l'API
- avoir les fichiers buildings en ```.js``` qui contient une liste ```monthlyConsumptions``` avec les valeurs: ```startDate``` et ```endDate``` dans un dossier ```buildings```
## Installation

```bash
npm install axios fs
```
## Utilisation
Ajouter votre token après le ```keycloak_token: ```
```bash
node script.js
```
Une fois le ```buildingData``` entièrement chargé:
```bash
node calculCumulTemperature.js
```
