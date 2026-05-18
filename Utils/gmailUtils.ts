import { Auth, google } from 'googleapis';
import readline from 'readline';
import path from 'path';
import fs from 'fs';
import { promises } from 'dns';

const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];

const CREDENTIALS_PATH = path.join(__dirname, 'credentials.json');
const TOKEN_PATH = path.join(__dirname, 'token.json');

export async function autenticate(): Promise<Auth.OAuth2Client>{
    if (!fs.existsSync(CREDENTIALS_PATH)) {
       throw new Error("No se encontró credentials.json en ./data. Descarga las credenciales de Google Cloud.");
        }

        const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf-8')).web;
        const { client_id, client_secret } = credentials;
        const redirect_uris = ['http://localhost'];

        const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
        
        if (fs.existsSync(TOKEN_PATH)) {
            const token = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf-8'));
            oAuth2Client.setCredentials(token);
            return oAuth2Client;
        }

        console.log('Cargando token desde token json.....');
        const token = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf-8'));
        oAuth2Client.setCredentials(token);
        console.log('Token cargado correctamente');

        return oAuth2Client;
}

export async function generateToken(): Promise<string | null> {
    try {
        const auth = await autenticate();
        const gmail = google.gmail({ version: 'v1', auth });

        console.log('Buscando el codigo de verificacion en los correos...');
        const response = await gmail.users.messages.list({
            userId: 'me',
            q: 'from: soporte@biosafeapp.com subject:"Tu codigo de verificacion"',
            maxResults: 1,
        });

        if (!response.data.messages) {
            console.error('No se encontraron correos con el codigo de verificacion.');
            return null;
        }

        const messageId = response.data.messages[0].id!;
        const message = await gmail.users.messages.get({ userId: 'me', id: messageId });

        const body = message.data.snippet || '';
        console.log('Cuerpo del correo:', body);


        
        //se busca un numero de 6 digitos en el cuerpo del correo
        const codeMatch = body.match(/(\b\d{6}\b)/);
        if (!codeMatch) {
            console.error('No se encontró un codigo de verificacion en el cuerpo del correoo.');
            return null;
        } else {
            return codeMatch[0];
        }

} catch (error) {
        console.error('Error obteniendo el codigo de verificacion:', error);
        return null;
    }
}