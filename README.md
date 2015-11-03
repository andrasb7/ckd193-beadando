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
###3.	Implementáció
###4.	Tesztelés
###5.	Felhasználói dokumentáció
