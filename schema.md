# Database Schema

## Collection: Admin

| Field | Type |
|-------|------|
| username | String |
| password | String |
| email | String |
## Collection: Dechet

| Field | Type |
|-------|------|
| categorieAnalyser | String |
## Collection: Date

| Field | Type |
|-------|------|
| idDechet | SchemaObjectId → ref: Dechet |
| date | String |
## Collection: Verification

| Field | Type |
|-------|------|
| idDechet | SchemaObjectId → ref: Dechet |
| categorieJeter | String |
## Collection: Statistique

| Field | Type |
|-------|------|
| categorieAnalyser | String |
| ratio | Number |
| TotalNumber | Number |
## Collection: Notification

| Field | Type |
|-------|------|
| categoriePoubelle | String |
| idAdmin | SchemaObjectId → ref: Admin |
| isFull | Boolean |
| notifIsSent | Boolean |
