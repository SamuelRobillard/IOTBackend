import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: ' Tricolo Backend API',
      version: '1.0.0',
      description: `

      `,
      
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    
    ],
    tags: [
      {
        name: 'Admin',
        description: 'Gestion des administrateurs et authentification',
      },
      {
        name: 'IOT',
        description: 'Upload et analyse des images de déchets',
      },
      {
        name: 'Notifications',
        description: "Gestion des notifications pour les poubelles lorsqu'elles sont pleines",
      },
      {
        name: 'Frontend Data',
        description: 'Données pour l\'interface utilisateur (déchets et statistiques)',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Token JWT pour l\'authentification',
        },
      },
      schemas: {
        Admin: {
          type: 'object',
          required: ['username', 'password', 'email'],
          properties: {
            _id: {
              type: 'string',
              description: 'ID unique de l\'administrateur',
              example: '507f1f77bcf86cd799439011',
            },
            username: {
              type: 'string',
              description: 'Nom d\'utilisateur',
              example: 'admin123',
            },
            password: {
              type: 'string',
              description: 'Mot de passe hashé',
              example: '$2b$10$abcdefghijklmnopqrstuv',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Adresse email',
              example: 'admin@iottricolo.com',
            },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['username', 'password'],
          properties: {
            username: {
              type: 'string',
              example: 'admin123',
            },
            password: {
              type: 'string',
              example: 'SecurePassword123!',
            },
          },
        },
        LoginResponse: {
          type: 'object',
          properties: {
            token: {
              type: 'string',
              description: 'Token JWT',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            },
            admin: {
              $ref: '#/components/schemas/Admin',
            },
          },
        },
        Dechet: {
          type: 'object',
          required: ['categorieAnalyser'],
          properties: {
            _id: {
              type: 'string',
              example: '507f1f77bcf86cd799439011',
            },
            categorieAnalyser: {
              type: 'string',
              enum: ['compost', 'recyclage', 'poubelle', 'autre', 'erreur'],
              description: 'Catégorie du déchet analysé',
              example: 'recyclage',
            },
          },
        },
        DTODechet: {
          type: 'object',
          required: ['idDechet', 'categorieAnalyser', 'categorieJeter', 'date'],
          properties: {
            idDechet: {
              type: 'string',
              description: 'ID unique du déchet',
              example: '69811c3c56f92ad6ecaf8fa4',
            },
            categorieAnalyser: {
              type: 'string',
              enum: ['compost', 'recyclage', 'poubelle', 'autre', 'erreur'],
              description: 'Catégorie du déchet analysé par l\'IA',
              example: 'recyclage',
            },
            categorieJeter: {
              type: 'string',
              enum: ['compost', 'recyclage', 'poubelle', 'Autre'],
              description: 'Catégorie dans laquelle le déchet a été jeté',
              example: 'recyclage',
            },
            date: {
              type: 'string',
              format: 'date',
              description: 'Date du jet du déchet',
              example: '2028-10-23',
            },
          },
        },
        Notification: {
          type: 'object',
          required: ['categoriePoubelle', 'idAdmin', 'isFull', 'notifIsSent'],
          properties: {
            _id: {
              type: 'string',
              example: '507f1f77bcf86cd799439011',
            },
            categoriePoubelle: {
              type: 'string',
              description: 'Catégorie de la poubelle',
              example: 'recyclage',
            },
            idAdmin: {
              type: 'string',
              description: 'ID de l\'administrateur',
              example: '507f1f77bcf86cd799439012',
            },
            isFull: {
              type: 'boolean',
              description: 'Indique si la poubelle est pleine',
              example: true,
            },
            notifIsSent: {
              type: 'boolean',
              description: 'Indique si la notification a été envoyée',
              example: false,
            },
          },
        },
        DateModel: {
          type: 'object',
          required: ['idDechet', 'date'],
          properties: {
            _id: {
              type: 'string',
              example: '507f1f77bcf86cd799439011',
            },
            idDechet: {
              type: 'string',
              description: 'ID du déchet associé',
              example: '507f1f77bcf86cd799439012',
            },
            date: {
              type: 'string',
              format: 'date',
              description: 'Date associée au déchet',
              example: '2028-10-23',
            },
          },
        },
        Verification: {
          type: 'object',
          required: ['idDechet', 'categorieJeter'],
          properties: {
            _id: {
              type: 'string',
              example: '507f1f77bcf86cd799439011',
            },
            idDechet: {
              type: 'string',
              description: 'ID du déchet vérifié',
              example: '507f1f77bcf86cd799439012',
            },
            categorieJeter: {
              type: 'string',
              enum: ['compost', 'recyclage', 'poubelle', 'Autre'],
              description: 'Catégorie dans laquelle le déchet a été jeté',
              example: 'recyclage',
            },
          },
        },
        Statistique: {
          type: 'object',
          required: ['categorieAnalyser', 'ratio', 'TotalNumber'],
          properties: {
            _id: {
              type: 'string',
              example: '6980fe25737075142256239b',
            },
            categorieAnalyser: {
              type: 'string',
              enum: ['compost', 'recyclage', 'poubelle', 'autre', 'erreur'],
              description: 'Catégorie analysée',
              example: 'recyclage',
            },
            ratio: {
              type: 'number',
              description: 'Ratio en pourcentage pour cette catégorie',
              example: 35.29,
            },
            TotalNumber: {
              type: 'number',
              description: 'Nombre total pour cette catégorie',
              example: 12,
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Message d\'erreur',
              example: 'Une erreur est survenue',
            },
            error: {
              type: 'string',
              description: 'Détails de l\'erreur',
              example: 'Invalid credentials',
            },
            statusCode: {
              type: 'number',
              description: 'Code HTTP de l\'erreur',
              example: 400,
            },
          },
        },
        UploadImageResponse: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'Image analysée avec succès',
            },
            categorie: {
              type: 'string',
              example: 'recyclage',
            },
            dechetId: {
              type: 'string',
              example: '507f1f77bcf86cd799439011',
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/controller/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
