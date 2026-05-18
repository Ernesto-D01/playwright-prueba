import {Page, Locator, expect} from "@playwright/test"; 

export default class PaginaLanding {
    readonly page: Page;
    readonly botonDeRegistro: Locator;


    constructor(page: Page) {
        this.page = page;
        this.botonDeRegistro = page.getByRole('link', { name: 'Registrarse' }).nth(0);
    }

    async IrRegistroCuenta(){
        
        this.botonDeRegistro.click({force: true});
        expect (this.page).toHaveURL('https://qa.biosafeapp.com/signup');
    }
}