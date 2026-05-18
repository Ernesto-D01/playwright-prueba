import { test, expect } from '@playwright/test';
import PaginaLanding from '../pages/PaginaLanding';
import PaginaSignup from '../pages/PaginaSignup';
import Data from '../Data/usuarios.json';
import { getVerificationCode} from '../Utils/gmailUtils';

let paginaLanding: PaginaLanding;
let paginaSignup: PaginaSignup;

test('C-1 Registro Happy Path', async ({ page }) => {
  paginaLanding = new PaginaLanding(page)
  paginaSignup = new PaginaSignup(page)
  await page.goto('https://qa.biosafeapp.com/.');
  await paginaLanding.IrRegistroCuenta();
  await paginaSignup.completaRegistroExitoso(Data.usuarios.correcto);
  console.log("codigo de verificación:", await getVerificationCode());
});

    