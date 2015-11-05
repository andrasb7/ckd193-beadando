# Dokumentáció
##Koktél receptek
Készítette: Peknyó Szilvia

###1.	Követelményanalízis
#####1.1.	Célkitűzés, projektindító dokumentum
A program legfőbb célja jól átláthatóan, és érthetően megjeleníteni az adott koktélok, és italok főbb tulajdonságait, és receptjüket. Az adatok védelme érdekében legyen lehetőség regisztrációra, majd bejelentkezésre. Bejelentkezett felhasználó a koktélok listáját megtekintheti, bővítheti, meglévő elemeket törölhet, valamit megjegyzéseket írhat. 

######Funkcionális követelmények:
* Regisztrációra
* Bejelentkezés
* Csak bejelentkezett felhasználók által elérhető funkciók
  - új ital felvételére a listába
  - a meglévő italok szerkesztésére
  - a meglévő italok törlésére
  - komment írása

######Nem funkcionális követelmények:
*	Könnyű áttekinthetőség: Színekkel típus szerint csoportosítás
*	Felhasználóbarát
*	Megbízhatóság: jelszóval védett funkciók

#####1.2.	Szakterületi fogalomjegyzék

**Fajták:**
* **Shot:** Felespohárban felszolgált, gyakran csak alkoholt tartalmazó ital.
* **Cocktail:** Koktélos pohárban, szirupokkal, gyömülcslevekkel készített ital.
* **Long drink:** Egyszerű long-os pohárban felszolgált ital, gyakran egy fajta alkoholt és üdítőt tartalmaz.
* **Aperitif:** Étkezések előtt, étvágy fokozás céljából fogyasztott ital.

**Alap ital:** A koktélban legnagyobb arányban részt vevő tömény alkohol.

#####1.3.	Használatieset-modell, funkcionális követelmények

**Vendég**: Csak a publikus oldalakat éri el

*	Főoldal
*	Bejelentkezés
*	Regisztráció

**Bejelentkezett felhasználó**: A publikus oldalak elérésén felül

*	Új recept felvétele
*	Meglévő recept megtekintése
*	Meglévő recept szerkesztése
*	Meglévő recept törlése
*	Komment írása

![](docs/images/teljes-esetdiagram.png)

Vegyünk példának egy egyszerű folyamatot:

**Meglévő recept szerkesztése:**

1.	A felhasználó az oldalra érkezve, bejelentkezik vagy regisztrál
2.	Regisztráció után megtekintheti a recepteket listázó oldalt, ahol kiválaszthatja a szerkeszteni kívánt receptet.
3.	Megnyomja a „Megtekintés” feliratú gombot
4.	A megtekintés oldalon kiválaszthatja a „Szerkesztés” gombot
5.	Szerkesztés oldalon felviszi az új adatokat
6.	Submit gombra kattintva elmenti a változásokat

![](docs/images/foly-leiro-esetdiagram.png)


###2.	Tervezés

#####2.1.	Architektúra terv
**Publikus:**
* Főoldal
* Bejelentkezés
* Regisztráció

**Bejelentkezett:**
* Főoldal
* Új koktél felvétele
* Listaoldal
  * Koktél törlése 
  * Koktél megtekintése
    * Koktél szerkesztése 
    * Komment hozzáfűzése

**Végpontok**

* GET/: főoldal
* GET/login: bejelentkező oldal
* POST/login: bejelentkező adatok felküldése
* GET/login/signup: regisztrációs oldal
* POST/login/signup: regisztrációs adatok felküldése
* GET/logout: kijelentkező oldal
* GET/recipes/list: koktéllista oldal
* GET/recipes/new: új koktél felvétele
* POST/recipes/new: új koktél felvételéhez szükséges adatok felküldése
* GET/recipes/id: koktél adatok
* POST/recipes/id: új megjegyzés felvitele
* GET/recipes/delete=id: koktél recept törlése
* GET/recipes/edit=id: koktél módosítása
* POST/recipes/edit=id: koktél módosítása, adatok felküldése

#####2.1. Felhasználói-felület modell

######2.1.1.Oldalvázlatok:
**Főoldal**
![](docs/images/kepernyokep/index.jpg)
**Regisztrációs oldal**
![](docs/images/kepernyokep/regisztracio.jpg)
**Bejelentkező oldal**
![](docs/images/kepernyokep/bejelentkezes.jpg)
**Koktél listaoldal**
![](docs/images/kepernyokep/list.jpg)
**Új koktél felvétele**
![](docs/images/kepernyokep/new.jpg)
**Koktél megtekintése**
![](docs/images/kepernyokep/id.jpg)
**Koktél szerkesztése**
![](docs/images/kepernyokep/edit.jpg)

######2.1.2.Végső megvalósítás kinézete:
 
###3.	Implementáció
###4.	Tesztelés
#####4.1. Tesztelési környezetek
Kétféle tesztelési módszert használunk a program teljeskörű tesztelésére. Először egységteszteket végzünk a mocha keretrendszer és a chai ellenőrző könyvtár segítségével. Egységtesztelés közben a modellek működését, a problémamentes funkciókat és műveleteket ellenőrizzük. 
Másodszor a funkciónális teszetelés segítségével a végpontokat ellenőrizzük, a megfelelő tartalom megjelenését, és az oldalak működőképességét ellenőrizzük.
#####4.2. Egységteszt

Kiválasztjuk a tesztelni kívánt modelt (ezesetben a user modelt), és létrehozunk hozzá egy tesztelő fájlt.
Legyen ez most a: **_user.test.js_**

Hozzuk létre az abstract modellréteget (ORM), majd vegyük sorra a teszteseteket.

Regisztráció tesztelése: user létrehozása
```
    it('should be able to create a user', function () {
        return User.create(getUserData())
        .then(function (user) {
            expect(user.felhnev).to.equal('abcdef');
            expect(bcrypt.compareSync('jelszo', user.password)).to.be.true;
            expect(user.surname).to.equal('Gipsz');
            expect(user.forename).to.equal('Jakab');
            expect(user.avatar).to.equal('');
        });
    });
```

Jelszó ellenőrzése, helyes és hibás jelszó esetén
```
    describe('#validPassword', function() {
        it('should return true with right password', function() {
             return User.create(getUserData()).then(function(user) {
                 expect(user.validPassword('jelszo')).to.be.true;
             })
        });
        it('should return false with wrong password', function() {
             return User.create(getUserData()).then(function(user) {
                 expect(user.validPassword('titkos')).to.be.false;
             })
        });
    });
```

#####4.3. Funkciónális teszetelés

Válasszuk ki a tesztelni kívánt modelt (ezesetben recipes), és hozzuk létre hozzá a tesztelő fájlt. Nevezzük el: **_recipes.test.js_**

Teszteljük sorban az egyes végpontok működését. Vegyünk most példának egy végpontot, és egy funkció működését:

Új recept oldal elérése:
```
    it('should go the recipe page', function () {
        return browser.visit('/recipes/new')
        .then(function () {
            browser.assert.success();
            browser.assert.text('div.page-header > h1', 'Új recept felvétele');
        });
    });
```
Sikeres bejelentkezés a megfelelő adatokkal:
```
    it('should be able to login with correct credentials', function (done) {
        browser
            .fill('felhnev', 'Ellasandra')
            .fill('password', 'titkos')
            .pressButton('button[type=submit]')
            .then(function () {
                browser.assert.redirected();
                browser.assert.success();
                browser.assert.url({ pathname: '/recipes/list' });
                done();
            });
    });
```

A tesztfájl lefuttatásához használt parancs: _npm test_

Sikeres tesztek lefutása után az alábbi üzenetet kell kapjuk:
```
pessaai:~/workspace/ckd193-beadando1 (master) $ npm test

> @ test /home/ubuntu/workspace/ckd193-beadando1
> node_modules/mocha/bin/mocha **/*.test.js



  User visits index page
    ✓ should be successful
    ✓ should see welcome page

  User visits new recipe page
    ✓ should go to the authentication page
    ✓ should be able to login with correct credentials (1706ms)
    ✓ should go the recipe page (154ms)

  UserModel
    ✓ should work
    ✓ should be able to create a user (536ms)
    ✓ should be able to find a user (514ms)
    ✓ should be able to update a user (524ms)
    #validPassword
      ✓ should return true with right password (493ms)
      ✓ should return false with wrong password (486ms)


  11 passing (5s)
```

#####4.4.Tesztesetek
* User
  * Felhasználó létrehozása
  * Felhasználó keresése
  * Felhasználó módosítása
  * Bejelentkezés jó, és rossz jelszóval
* Recipe
  * Főoldal láthatósága
  * Új recept felvétele oldal láthatósága
  * Csak bejelentkezett felhasználó által látható oldal láthatósága
  * Sikeres bejelentkezés

  
###5.	Felhasználói dokumentáció
