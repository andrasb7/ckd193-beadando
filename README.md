# ckd193-beadando
# Dokumentáció
##Koktél receptek
Készítette: Peknyó Szilvia

###1.	Követelmények feltárása
#####1.1.	Célkitűzés, projektindító dokumentum
A program legfőbb célja jól átláthatóan, és érthetően megjeleníteni az adott koktélok, és italok főbb tulajdonságait, és receptjüket. 
######Funkcionális követelmények :
* Regisztrációra
* Bejelentkezés
* Csak bejelentkezett felhasználók által elérhető funkciók
  - új ital felvételére a listába
  - a meglévő italok szerkesztésére
  - a meglévő italok törlésére

######Nem funkcionális követelmények :
*	Könnyű áttekinthetőség: Színekkel típus szerint csoportosítás
*	Felhasználóbarát
*	Megbízhatóság: jelszóval védett funkciók

#####1.2.	Szakterületi fogalomjegyzék

#####1.3.	Használatieset-modell, funkcionális követelmények

**Vendég**: Csak a publikus oldalakat éri el

*	Főoldal
*	Bejelentkezés
*	Regisztráció

**Bejelentkezett felhasználó**: 

*	Új recept felvétele
*	Meglévő recept szerkesztése
*	Meglévő recept törlése
*	Komment írása

Vegyünk példának egy egyszerű folyamatot:

**Meglévő recept szerkesztése:**

1.	A felhasználó az oldalra érkezve, bejelentkezik vagy regisztrál
2.	Regisztráció után megtekintheti a recepteket listázó oldalt, ahol kiválaszthatja a szerkeszteni kívánt receptet.
3.	Megnyomja a „Megtekintés” feliratú gombot
4.	A megtekintés oldalon kiválaszthatja a „Szerkesztés” gombot
5.	Szerkesztés oldalon felviszi az új adatokat
6.	Submit gombra kattintva elmenti a változásokat, és megtekinti a listaoldalt



###2.	Tervezés

#####2.1.	A program architektúrája
#Publikus:#
* Főoldal
* Bejelentkezés
* Regisztráció

#Bejelentkezett:#
* Főoldal
* Új koktél felvétele
* Listaoldal
  * Koktél törlése 
  * Koktél megtekintése
    * Koktél szerkesztése 
    * Komment hozzáfűzése

#####2.2. Végpontok

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

#####2.3. Felhasználói-felület modell
Oldalvázlatok:
 
###3.	Implementáció
###4.	Tesztelés
###5.	Felhasználói dokumentáció
