Setup database for testing
2: Download visual studio mysql server og følg guidelines.
3: Download visual studio mysql workbench og følg deres guidelines
4: Åben inventoriamain og hent den seneste version af mysql serverkoden som du kører på den lokale server.

Setup api
1: Sæt miljøvariabelen "JWT_KEY" til testning eller udkommenter den indbyggede og mindre sikre nøgle der ligger i appsettings i program.cs og i create user controlleren
1b: Når du sætter ny miljøvariabel skal du evt. genstarte visual studio og/ eller computeren
2: Start Api'en op og gå ind og opret en user. Husk at give useren rettigheder, ellers kan du ikke gøre så meget.

Setup ngrok
1: Download ngrok agent fra hjemmesiden
2: Sæt dit authtoken efter at have startet executive. Her bliver i nødt til at bruge jeres eget hvis i gerne vil have jeres egen version, man kan sætte en gratis konto op
3: kør ngrok http https://localhost:7027 som gratis konto
4: med betalt konto kører jeg 
ngrok http --domain=outgoing-eminent-jennet.ngrok-free.app https://localhost:7027
, hvor i skal bruge jeres eget domæne
5: Bemærk at jeg har sat ngrok som en path, hvis I ikke har det skal i gå til folderen hvor i lagde det

Setup pagekite
1:download python 2.718 - python 3 fungerer ikke med kite
2:Download pagekite.py and sæt det op i path, systemvariablen

3: kør
pagekite.py https://localhost:7027 dragon723.pagekite.me
i kommandoprompt
3b: Du skal oprette din egen kite for at kunne gøre dette, så i stedet for dragon723.pagekite.me vil det være ditdomænenavn.pagekite.me

Perifere enheder
1: Download Arduino IDE
2: Download herefter CP210 windows drivers (følg evt. denne guide https://randomnerdtutorials.com/install-esp32-esp8266-usb-drivers-cp210x-windows/)
3: I arduino IDE skal du sætte ESP32 op som board. Det gør du ved at gå til 
\InventoriaMain\Documentation\Periferals setup script\SetupTemperatureandhumiditysensorwithapiaccess\
i stifinderen
3b: Herefter åbner du File>Preferences og i Additional Boards Manager URLs sætter du
https://dl.espressif.com/dl/package_esp32_index.json
https://espressif.github.io/arduino-esp32/package_esp32_index.json
4: Gå ind og vælg board. Skriv esp32 dev Module. Her skriver den så at boardet ikke er installeret, hvilket du lader den gøre automatisk. 
5: Tryk på compile. 
6: Hold EN inde og tryk på ioo når den begynder at uploade, det ressetter den og gør den klar til at blive opdateret