VORALB LIEBE – GEPRÜFTES WEBSITEPAKET
Stand: 10.10.2026

ORDNERSTRUKTUR
Alle HTML-, CSS-, JavaScript-, PHP- und Bilddateien dieses Pakets liegen direkt
im selben Ordner. Ein assets-Unterordner ist für diese Fassung nicht nötig.
Die Startdatei heißt index.html. Die mitgelieferte ursprüngliche index(1).html
war eine identische Kopie der alten Startseite und gehört nicht in dieses Paket.

EINRICHTEN
1. ZIP-Datei vollständig entpacken.
2. Alle Website-Dateien gemeinsam in den bisherigen Website-Ordner kopieren
   und die gleichnamigen Dateien ersetzen. Beim Upload den Inhalt des entpackten
   Ordners verwenden, damit index.html direkt im Website-Hauptverzeichnis liegt.
3. Die Startseite über index.html bzw. die Internetadresse öffnen.
   Wenn noch das alte Menü erscheint, die Seite mit Strg + F5 neu laden.
4. CSS, JavaScript und Logo immer mit hochladen. Eine einzelne heruntergeladene
   index.html außerhalb des Website-Ordners kann diese Ressourcen nicht laden.

NAVIGATION
Startseite, Leistungen, Über mich, Onlineshop, Kontakt.
Über mich führt von jeder Seite zu index.html#ueber-mich.
Der neue Abschnitt enthält ein Fotofeld und Textplatzhalter.
Die bisherige Seite Aktuelles bleibt über ihre Inhalte verlinkt.
header.inc ist lediglich eine Dokumentationsdatei. Der gemeinsame Header ist
weiterhin direkt in jeder HTML-Datei enthalten.

FORMULARE
In contact.php und order.php steht als Empfänger noch DEINE-EMAIL@BEISPIEL.DE.
Diese Adresse durch die tatsächliche Empfängeradresse ersetzen. Zusätzlich
muss der Webspace PHP und den Mailversand bereitstellen. Die angegebene
Absenderadresse no-reply@voralbliebe.de muss zum erlaubten Mail-Setup passen.
Das bloße Öffnen der HTML-Datei auf dem Computer stellt keinen PHP-Mailserver
bereit. Die HTML-Seiten können lokal betrachtet werden; den Mailversand erst
auf dem tatsächlichen Webspace mit eingerichteten Adressen testen.

Ohne konfigurierte Empfängeradresse wird jetzt eine Fehlermeldung ausgegeben,
statt einen erfolgreichen Versand vorzutäuschen. Pflichtfelder, Datentypen,
Textlängen und Datenschutzhinweis werden auf dem Server geprüft. Das bisherige
versteckte Spam-Feld bleibt erhalten. Der Browser verhindert doppelte Klicks
auf den Senden-Button während einer laufenden Anfrage.

SHOP
Die Artikel stehen zentral in products.js. Die acht Produkte und ihre Preise
sind weiterhin Beispieldaten; als Produktbilder dienen Emojis.
Der Warenkorb bleibt lokal im Browser gespeichert. Ist der Browserspeicher
nicht verfügbar, funktioniert er innerhalb der geöffneten Seite weiter.
Checkout bedeutet hier Bestellanfrage, nicht Onlinezahlung. Die Anfrage enthält
vom Browser übermittelte Artikel und Preise; vor einem Angebot prüfen.
Eine Zahlungsanbindung ist nicht enthalten.

INHALTE
Name, Foto und persönliche Vorstellung im Über-mich-Abschnitt ergänzen.
Anschrift, Telefon, E-Mail und Instagram enthalten weiterhin Platzhalter.
Auch Impressum und Datenschutz enthalten Platzhalter und sind keine fertig
individualisierten Rechtstexte. Produktdaten und Bilder vor Verwendung prüfen.

SUCHMASCHINEN
Die bestehende Einstellung index,follow und die Freigabe in robots.txt wurden
beibehalten. sitemap.xml enthält die bestehenden Seiten einschließlich Aktuelles.
Die Domainangaben lauten unverändert https://voralbliebe.de/.

DATEIEN
index.html, leistungen.html, shop.html, aktuelles.html, kontakt.html,
impressum.html, datenschutz.html: Website-Seiten.
styles.css: Gestaltung einschließlich Über-mich-Abschnitt und mobiler Darstellung.
products.js, main.js, forms.js: Produkte, Warenkorb, Navigation und Formularversand.
contact.php, order.php: Serverseitige Verarbeitung der Anfragen.
logo-voralbliebe.jpg: Vorhandenes Logo, unverändert.
robots.txt, sitemap.xml: Suchmaschinen-Dateien.
.htaccess: Apache-Sicherheitsheader und deaktivierte Verzeichnisauflistung;
kein Passwortschutz.
Pruefbericht.txt: Festgestellte Fehler, Korrekturen und Grenzen der Prüfung.
