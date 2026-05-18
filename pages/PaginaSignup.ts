import {Page, Locator, expect} from "@playwright/test"; 

export default class PaginaSignup {
    readonly page: Page;
    readonly nameInput: Locator;
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly confirmPasswordInput: Locator;
    readonly botonDeRegistro: Locator;
    readonly mensajeDeExito: Locator;



    constructor(page: Page) {
        this.page = page;
        this.nameInput = page.getByTestId('nameInput')
        this.emailInput = page.getByTestId('emailInput')
        this.passwordInput = page.getByTestId('passwordInput')
        this.confirmPasswordInput = page.getByTestId('confirmPasswordInput')
        this.botonDeRegistro = page.getByTestId('botonRegistro')
        this.mensajeDeExito = page.getByTestId('mensajeExito')
}

    async completaRegistroExitoso(user: any){
        
        const EmailUsuarioUnico = user.email.replace('@', "+" + Date.now() + "@");
        console.log(EmailUsuarioUnico);

        await this.nameInput.fill(user.name);
        await this.emailInput.fill(EmailUsuarioUnico);
        await this.passwordInput.fill(user.password);
        await this.confirmPasswordInput.fill(user.password);
        await this.botonDeRegistro.click();
        await expect(this.mensajeDeExito).toBeVisible();


    }


}