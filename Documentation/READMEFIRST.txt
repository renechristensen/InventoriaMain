Setup database for testing
2: Download visual studio mysql server og følg guidelines.
3: Download visual studio mysql workbench og følg deres guidelines
4: Åben inventoriamain og hent den seneste version af mysql serverkoden som du kører på den lokale server.

Setup api
1: Sæt miljøvariabelen "JWT_KEY" til testning eller udkommenter den indbyggede og mindre sikre nøgle der ligger i appsettings i program.cs og i create user controlleren
1b: Når du sætter ny miljøvariabel skal du evt. genstarte visual studio og/ eller computeren

Setup ngrok
1: Download ngrok agent fra hjemmesiden
2: Sæt dit authtoken efter at have startet executive. Her bliver i nødt til at bruge jeres eget hvis i gerne vil have jeres egen version, man kan sætte en gratis konto op
3: kør ngrok http https://localhost:7027 som gratis konto
4: med betalt konto kører jeg ngrok http --domain=outgoing-eminent-jennet.ngrok-free.app https://localhost:7027, hvor i skal bruge jeres eget domæne

Setup pagekite
1:download python 2.718 - python 3 does not work with kite
2:Download pagekite.py and set it up in a folder
3:Set it as a path in system variabels
4: run pagekite.py https://localhost:7027 dragon723.pagekite.me
4b: You will need your own kite, so instead of dragon723.pagekite.me it would be yourdomain.pagekite.me

Perifere enheder
1: Download Arduino IDE
2: 