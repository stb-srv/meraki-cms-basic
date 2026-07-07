'use client';

import Link from 'next/link';
import { useSettings } from '@/hooks/useSettings';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function DatenschutzPage() {
  const { settings, loading } = useSettings();

  if (loading) {
    return (
      <>
        <Header />
        <LoadingSpinner fullPage text="Lade Datenschutz..." />
        <Footer />
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Datenschutzerklärung
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Informationen zur Verarbeitung Ihrer Daten
              </p>
            </div>

            <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
                1. Datenschutz auf einen Blick
              </h2>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
                Allgemeine Hinweise
              </h3>
              <p>
                Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren 
                personenbezogenen Daten passiert, wenn Sie unsere Website besuchen. Personenbezogene 
                Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können. 
                Ausführliche Informationen zum Thema Datenschutz entnehmen Sie unserer unter diesem 
                Text aufgeführten Datenschutzerklärung.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
                Datenerfassung auf unserer Website
              </h3>

              <h4 className="text-lg font-medium text-gray-900 dark:text-white mt-4 mb-2">
                Wer ist verantwortlich für die Datenerfassung auf dieser Website?
              </h4>
              <p>
                Die Datenverarbeitung auf dieser Website wird durch den Websitebetreiber durchgeführt. 
                Dessen Kontaktdaten können Sie dem Impressum dieser Website entnehmen.
              </p>

              <h4 className="text-lg font-medium text-gray-900 dark:text-white mt-4 mb-2">
                Wie erfassen wir Ihre Daten?
              </h4>
              <p>
                Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen. Hierbei 
                kann es sich z. B. um Daten handeln, die Sie in ein Kontaktformular eingeben.
              </p>
              <p>
                Andere Daten werden automatisch beim Besuch der Website durch unsere IT-Systeme 
                erfasst. Das sind vor allem technische Daten (z. B. Internetbrowser, Betriebssystem 
                oder Uhrzeit des Seitenaufrufs). Die Erfassung dieser Daten erfolgt automatisch, sobald 
                Sie unsere Website betreten.
              </p>

              <h4 className="text-lg font-medium text-gray-900 dark:text-white mt-4 mb-2">
                Wofür nutzen wir Ihre Daten?
              </h4>
              <p>
                Ein Teil der Daten wird erhoben, um eine fehlerfreie Bereitstellung der Website zu 
                gewährleisten. Andere Daten können zur Analyse Ihres Nutzerverhaltens verwendet werden.
              </p>

              <h4 className="text-lg font-medium text-gray-900 dark:text-white mt-4 mb-2">
                Welche Rechte haben Sie bezüglich Ihrer Daten?
              </h4>
              <p>
                Sie haben jederzeit das Recht unentgeltlich Auskunft über Herkunft, Empfänger und 
                Zweck Ihrer gespeicherten personenbezogenen Daten zu erhalten. Sie haben außerdm ein 
                Recht, die Berichtigung oder Löschung dieser Daten zu verlangen. Wenn Sie eine 
                Einwilligung zur Datenverarbeitung erteilt haben, können Sie diese Einwilligung 
                jederzeit für die Zukunft widerrufen. Außerdem haben Sie das Recht, unter bestimmten 
                Umständen die Einschränkung der Verarbeitung Ihrer personenbezogenen Daten zu verlangen. 
                Des Weiteren steht Ihnen ein Beschwerderecht bei der zuständigen Aufsichtsbehörde zu.
              </p>
              <p>
                Hierzu sowie zu weiteren Fragen zum Thema Datenschutz können Sie sich jederzeit unter 
                der im Impressum angegebenen Adresse an uns wenden.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
                Analyse-Tools und Tools von Drittanbietern
              </h3>
              <p>
                Beim Besuch unserer Website kann Ihr Surf-Verhalten statistisch ausgewertet werden. 
                Das geschieht vor allem mit Cookies und mit sogenannten Analyseprogrammen. 
                Die Analyse Ihres Surf-Verhaltens erfolgt in der Regel anonym; das Surf-Verhalten 
                kann nicht zu Ihnen zurückverfolgt werden.
              </p>
              <p>
                Sie können dieser Analyse widersprechen oder sie durch die Nichtbenutzung bestimmter 
                Tools verhindern. Detaillierte Informationen zu diesen Tools und über Ihre 
                Widerspruchsmöglichkeiten finden Sie in der folgenden Datenschutzerklärung.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
                2. Hosting
              </h2>
              <p>
                Wir hosten die Inhalte unserer Website bei folgendem Anbieter:
              </p>
              <p>
                <strong>Vercel Inc.</strong>
                <br />
                440 N Barranca Ave #7171
                <br />
                San Francisco, CA 94111
                <br />
                USA
              </p>
              <p>
                Wenn Sie unsere Website besuchen, werden die personenbezogenen Daten, die Sie 
                eingeben (z. B. E-Mail-Adressen, Namen, Adressen), auf den Servern von Vercel 
                gespeichert. Die Speicherung erfolgt in den USA.
              </p>
              <p>
                Wir haben mit Vercel einen Vertrag über Auftragsverarbeitung (AVV) geschlossen. 
                Dabei handelt es sich um einen datenschutzrechtlich vorgeschriebenen Vertrag, der 
                garantiert, dass dieser die personenbezogenen Daten unserer Website-Besucher nur nach 
                unseren Weisungen und unter Einhaltung der DSGVO verarbeitet.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
                3. Allgemeine Hinweise und Pflichtinformationen
              </h2>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
                Datenschutz
              </h3>
              <p>
                Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst. 
                Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend der 
                gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung.
              </p>
              <p>
                Wenn Sie diese Website benutzen, werden verschiedene personenbezogene Daten 
                gesammelt. Personenbezogene Daten sind Daten, mit denen Sie persönlich identifiziert 
                werden können. Die vorliegende Datenschutzerklärung erläutert, welche Daten wir 
                erheben und wofür wir sie nutzen. Sie erläutert auch, wie und zu welchem Zweck das 
                geschieht.
              </p>
              <p>
                Wir weisen darauf hin, dass die Datenübertragung im Internet (z. B. bei der 
                Kommunikation per E-Mail) Sicherheitslücken aufweisen kann. Ein lückenloser Schutz 
                der Daten vor dem Zugriff durch Dritte ist nicht möglich.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
                Hinweis zur verantwortlichen Stelle
              </h3>
              <p>
                Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist:
              </p>
              <p>
                <strong>{settings?.name || 'Taverna Zeus'}</strong>
                <br />
                {settings?.address}
                <br />
                {settings?.postal_code} {settings?.city}
                <br />
                Telefon: {settings?.phone}
                <br />
                E-Mail: {settings?.email}
              </p>
              <p>
                Verantwortliche Stelle ist die natürliche oder juristische Person, die allein oder 
                gemeinsam mit anderen über die Zwecke und Mittel der Verarbeitung von 
                personenbezogenen Daten (z. B. Namen, E-Mail-Adressen o. Ä.) entscheidet.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
                Widerruf Ihrer Einwilligung zur Datenverarbeitung
              </h3>
              <p>
                Viele Datenverarbeitungsvorgänge sind nur mit Ihrer ausdrücklichen Einwilligung 
                möglich. Sie können eine bereits erteilte Einwilligung jederzeit widerrufen. Die 
                Rechtmäßigkeit der bis zum Widerruf erfolgten Datenverarbeitung bleibt vom Widerruf 
                unberührt.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
                Widerspruchsrecht gegen die Datenerhebung in besonderen Fällen sowie gegen 
                Direktwerbung (Art. 21 DSGVO)
              </h3>
              <p>
                WENN DIE DATENVERARBEITUNG AUF GRUNDLAGE VON ART. 6 ABS. 1 LIT. E ODER F DSGVO ERFOLGT, 
                HABEN SIE JEDERZEIT DAS RECHT, AUS GRÜNDEN, DIE SICH AUS IHRER BESONDEREN SITUATION 
                ERGEBEN, GEGEN DIE VERARBEITUNG IHRER PERSONENBEZOGENEN DATEN WIDERSPRUCH EINZULEGEN; 
                DIES GILT AUCH FÜR EIN AUF DIESE BESTIMMUNGEN GESTÜTZTES PROFILING. DIE JEWEILIGE 
                RECHTSGRUNDLAGE, AUF DEREN GRUNDLAGE EINE VERARBEITUNG ERFOLGT, ENTNEHMEN SIE DIESER 
                DATENSCHUTZERKLÄRUNG. WENN SIE WIDERSPRUCH EINLEGEN, WERDEN WIR IHRE BETROFFENEN 
                PERSONENBEZOGENEN DATEN NICHT MEHR VERARBEITEN, ES SEI DEN, WIR KÖNNEN ZWINGENDE 
                SCHUTZWÜRDIGE GRÜNDE FÜR DIE VERARBEITUNG NACHWEISEN, DIE IHRE INTERESSEN, RECHTE UND 
                FREIHEITEN ÜBERWIEGEN ODER DIE VERARBEITUNG DIENT DER GELTENDMACHUNG, AUSÜBUNG ODER 
                VERTEIDIGUNG VON RECHTSANSPRÜCHEN (WIDERSPRUCH NACH ART. 21 ABS. 1 DSGVO).
              </p>
              <p>
                WERDEN IHRE PERSONENBEZOGENEN DATEN VERARBEITET, UM DIREKTWERBUNG ZU BETREIBEN, SO 
                HABEN SIE DAS RECHT, JEDERZEIT WIDERSPRUCH GEGEN DIE VERARBEITUNG SIE BETREFFENDER 
                PERSONENBEZOGENER DATEN ZUM ZWECKE DERARTIGER WERBUNG EINZULEGEN. DIES GILT AUCH FÜR 
                DAS PROFILING, SOWEIT ES MIT SOLCHER DIREKTWERBUNG IN VERBINDUNG STEHT. WENN SIE 
                WIDERSPRUCH EINLEGEN, WERDEN IHRE PERSONENBEZOGENEN DATEN ANSCHLIESSEND NICHT MEHR ZUM 
                ZWECKE DER DIREKTWERBUNG VERWENDET (WIDERSPRUCH NACH ART. 21 ABS. 2 DSGVO).
              </p>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
                Beschwerderecht bei der zuständigen Aufsichtsbehörde
              </h3>
              <p>
                Im Falle von Verstößen gegen die DSGVO steht den Betroffenen ein Beschwerderecht 
                bei einer Aufsichtsbehörde, insbesondere in dem Mitgliedstaat ihres gewöhnlichen 
                Aufenthaltsorts, ihres Arbeitsplatzes oder des Orts des mutmaßlichen Verstoßes zu. 
                Das Beschwerderecht besteht unbeschadet sonstiger verwaltungsrechtlicher oder 
                gerichtlicher Rechtsbehelfe.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
                Recht auf Datenübertragbarkeit
              </h3>
              <p>
                Sie haben das Recht, Daten, die wir auf Grundlage Ihrer Einwilligung oder in 
                Erfüllung eines Vertrags automatisiert verarbeiten, an sich oder an einen Dritten in 
                einem gängigen, maschinenlesbaren Format aushändigen zu lassen. Sofern Sie die 
                direkte Übertragung der Daten an einen anderen Verantwortlichen verlangen, erfolgt 
                dies nur, soweit es technisch machbar ist.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
                SSL- bzw. TLS-Verschlüsselung
              </h3>
              <p>
                Diese Seite nutzt aus Sicherheitsgründen und zum Schutz der Übertragung vertraulicher 
                Inhalte, wie zum Beispiel Bestellungen oder Anfragen, die Sie an uns als Seitenbetreiber 
                senden, eine SSL- bzw. TLS-Verschlüsselung. Eine verschlüsselte Verbindung erkennen 
                Sie daran, dass die Adresszeile des Browsers von „http://“ auf „https://“ wechselt und 
                an dem Schloss-Symbol in Ihrer Browserzeile.
              </p>
              <p>
                Wenn die SSL- bzw. TLS-Verschlüsselung aktiviert ist, können die Daten, die Sie an 
                uns übermitteln, nicht von Dritten mitgelesen werden.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
                Auskunft, Sperrung, Löschung
              </h3>
              <p>
                Sie haben im Rahmen der geltenden gesetzlichen Bestimmungen jederzeit das Recht auf 
                unentgeltliche Auskunft über Ihre gespeicherten personenbezogenen Daten, deren Herkunft 
                und Empfänger und den Zweck der Datenverarbeitung und ggf. ein Recht auf Berichtigung, 
                Sperrung oder Löschung dieser Daten. Hierzu sowie zu weiteren Fragen zum Thema 
                personenbezogene Daten können Sie sich jederzeit unter der im Impressum angegebenen 
                Adresse an uns wenden.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
                Recht auf Einschränkung der Verarbeitung
              </h3>
              <p>
                Sie haben das Recht, die Einschränkung der Verarbeitung Ihrer personenbezogenen Daten 
                zu verlangen. Hierzu können Sie sich jederzeit unter der im Impressum angegebenen 
                Adresse an uns wenden. Das Recht auf Einschränkung der Verarbeitung besteht in 
                folgenden Fällen:
              </p>
              <ul className="list-disc pl-6">
                <li>
                  Wenn Sie die Richtigkeit Ihrer bei uns gespeicherten personenbezogenen Daten 
                  bestreiten, benötigen wir in der Regel Zeit, um dies zu überprüfen. Für die Dauer 
                  der Prüfung haben Sie das Recht, die Einschränkung der Verarbeitung Ihrer 
                  personenbezogenen Daten zu verlangen.
                </li>
                <li>
                  Wenn die Verarbeitung Ihrer personenbezogenen Daten unrechtmäßig geschah/geschieht, 
                  können Sie statt der Löschung die Einschränkung der Datenverarbeitung verlangen.
                </li>
                <li>
                  Wenn wir Ihre personenbezogenen Daten nicht mehr benötigen, Sie sie jedoch zur 
                  Ausübung, Verteidigung oder Geltendmachung von Rechtsansprüchen benötigen, haben 
                  Sie das Recht, statt der Löschung die Einschränkung der Verarbeitung Ihrer 
                  personenbezogenen Daten zu verlangen.
                </li>
                <li>
                  Wenn Sie einen Widerspruch nach Art. 21 Abs. 1 DSGVO eingelegt haben, muss eine 
                  Abwägung zwischen Ihren und unseren Interessen vorgenommen werden. Solange noch nicht 
                  feststeht, wessen Interessen überwiegen, haben Sie das Recht, die Einschränkung der 
                  Verarbeitung Ihrer personenbezogenen Daten zu verlangen.
                </li>
              </ul>
              <p>
                Wenn Sie die Verarbeitung Ihrer personenbezogenen Daten eingeschränkt haben, dürfen 
                diese Daten – von ihrer Speicherung abgesehen – nur mit Ihrer Einwilligung oder zur 
                Geltendmachung, Ausübung oder Verteidigung von Rechtsansprüchen oder zum Schutz der 
                Rechte einer anderen natürlichen oder juristischen Person oder aus Gründen eines 
                wichtigen öffentlichen Interesses der Europäischen Union oder eines Mitgliedstaats 
                verarbeitet werden.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
                4. Datenerfassung auf dieser Website
              </h2>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
                Cookies
              </h3>
              <p>
                Unsere Internetseiten verwenden so genannte „Cookies“. Cookies sind kleine Textdateien 
                und richten auf Ihrem Endgerät keinen Schaden an. Sie werden entweder vorübergehend für 
                die Dauer einer Sitzung (Session-Cookies) oder dauerhaft (Dauercookies) auf Ihrem 
                Endgerät gespeichert. Session-Cookies werden nach Ende Ihres Besuchs automatisch 
                gelöscht. Dauercookies bleiben auf Ihrem Endgerät gespeichert, bis Sie diese selbst 
                löschen oder eine automatische Löschung durch Ihren Webbrowser erfolgt.
              </p>
              <p>
                Teilweise können auch Cookies von Drittunternehmen auf Ihrem Endgerät gespeichert 
                werden, wenn Sie unsere Seite betreten (Drittanbieter-Cookies). Diese ermöglichen uns 
                oder Ihnen die Nutzung bestimmter Dienstleistungen des Drittunternehmens 
                (z. B. Cookies zur Abwicklung von Zahlungsdienstleistungen).
              </p>
              <p>
                Cookies haben verschiedene Funktionen. Zahlreiche Cookies sind technisch notwendig, 
                da bestimmte Webseitenfunktionen ohne diese nicht funktionieren würden (z. B. die 
                Warenkorbfunktion oder die Anzeige von Videos). Andere Cookies dienen dazu, das 
                Nutzerverhalten auszuwerten oder Werbung anzuzeigen.
              </p>
              <p>
                Cookies, die zur Durchführung des elektronischen Kommunikationsvorgangs (notwendige 
                Cookies) oder zur Bereitstellung bestimmter, von Ihnen erwünschter Funktionen 
                (funktionale Cookies, z. B. für die Warenkorbfunktion) oder zur Optimierung der 
                Website (z. B. Cookies zur Messung des Webpublikums) erforderlich sind, werden auf 
                Grundlage von Art. 6 Abs. 1 lit. f DSGVO gespeichert, sofern keine andere 
                Rechtsgrundlage angegeben wird. Der Websitebetreiber hat ein berechtigtes Interesse an 
                der Speicherung von Cookies zur technisch fehlerfreien und optimierten Bereitstellung 
                seiner Dienste. Sofern eine Einwilligung zur Speicherung von Cookies abgefragt wurde, 
                erfolgt die Speicherung der betroffenen Cookies ausschließlich auf Grundlage dieser 
                Einwilligung (Art. 6 Abs. 1 lit. a DSGVO); die Einwilligung ist jederzeit widerrufbar.
              </p>
              <p>
                Sie können Ihren Browser so einstellen, dass Sie über das Setzen von Cookies 
                informiert werden und Cookies nur im Einzelfall erlauben, die Annahme von Cookies für 
                bestimmte Fälle oder generell ausschließen sowie das automatische Löschen der Cookies 
                beim Schließen des Browsers aktivieren. Bei der Deaktivierung von Cookies kann die 
                Funktionalität dieser Website eingeschränkt sein.
              </p>
              <p>
                Soweit Cookies von Drittunternehmen oder zu Analysezwecken verwendet werden, 
                informieren wir Sie hierüber gesondert im Rahmen dieser Datenschutzerklärung und 
                holen ggf. Ihre Einwilligung ein.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
                Server-Log-Dateien
              </h3>
              <p>
                Der Provider der Seiten erhebt und speichert automatisch Informationen in so 
                genannten Server-Log-Dateien, die Ihr Browser automatisch an uns übermittelt. Dies sind:
              </p>
              <ul className="list-disc pl-6">
                <li>Browsertyp und Browserversion</li>
                <li>verwendetes Betriebssystem</li>
                <li>Referrer URL</li>
                <li>Hostname des zugreifenden Rechners</li>
                <li>Uhrzeit der Serveranfrage</li>
                <li>IP-Adresse</li>
              </ul>
              <p>
                Eine Zusammenführung dieser Daten mit anderen Datenquellen wird nicht vorgenommen.
              </p>
              <p>
                Die Erfassung dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO. Der 
                Websitebetreiber hat ein berechtigtes Interesse an der technisch fehlerfreien 
                Darstellung und der Optimierung seiner Website – hierzu müssen die Server-Log-Files 
                erfasst werden.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
                Kontaktformular
              </h3>
              <p>
                Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben aus 
                dem Anfrageformular inklusive der von Ihnen dort angegebenen Kontaktdaten zur 
                Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert. 
                Diese Daten geben wir nicht ohne Ihre Einwilligung weiter.
              </p>
              <p>
                Die Verarbeitung dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO, 
                sofern Ihre Anfrage mit der Erfüllung eines Vertrags zusammenhängt oder zur 
                Durchführung vorvertraglicher Maßnahmen erforderlich ist. In allen anderen Fällen ist 
                die Verarbeitung auf unser berechtigtes Interesse an der effektiven Bearbeitung der an 
                uns gerichteten Anfragen (Art. 6 Abs. 1 lit. f DSGVO) oder auf Ihre Einwilligung (Art. 6 
                Abs. 1 lit. a DSGVO) gestützt, sofern diese abgefragt wurde.
              </p>
              <p>
                Die von Ihnen im Kontaktformular eingegebenen Daten verbleiben bei uns, bis Sie uns zur 
                Löschung auffordern, Ihre Einwilligung zur Speicherung widerrufen oder der Zweck für die 
                Datenspeicherung entfällt (z. B. nach abgeschlossener Bearbeitung Ihrer Anfrage). 
                Zwingende gesetzliche Bestimmungen – insbesondere gesetzliche Aufbewahrungsfristen – 
                bleiben unberührt.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
                5. Analyse-Tools und Werbung
              </h2>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
                Google Maps
              </h3>
              <p>
                Diese Seite nutzt über eine API den Kartendienst Google Maps. Anbieter ist die Google 
                Ireland Limited („Google“), Gordon House, Barrow Street, Dublin 4, Irland.
              </p>
              <p>
                Zur Nutzung der Funktionen von Google Maps ist es notwendig, Ihre IP-Adresse zu 
                speichern. Diese Informationen werden in der Regel an einen Server von Google in den 
                USA übertragen und dort gespeichert. Der Anbieter dieser Seite hat keinen Einfluss auf 
                diese Datenübertragung.
              </p>
              <p>
                Die Nutzung von Google Maps erfolgt im Interesse einer ansprechenden Darstellung 
                unserer Online-Angebote und an einer leichten Auffindbarkeit der von uns auf der 
                Website angegebenen Orte. Dies stellt ein berechtigtes Interesse im Sinne von Art. 6 
                Abs. 1 lit. f DSGVO dar. Sofern eine entsprechende Einwilligung abgefragt wurde, 
                erfolgt die Verarbeitung ausschließlich auf Grundlage von Art. 6 Abs. 1 lit. a DSGVO; die 
                Einwilligung ist jederzeit widerrufbar.
              </p>
              <p>
                Mehr Informationen zum Umgang mit Nutzerdaten finden Sie in der Datenschutzerklärung 
                von Google: <Link href="https://policies.google.com/privacy?hl=de" className="text-primary-600 dark:text-primary-400 hover:underline">https://policies.google.com/privacy?hl=de</Link>.
              </p>

              <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Quelle: <Link href="https://www.e-recht24.de" className="text-primary-600 dark:text-primary-400 hover:underline">eRecht24</Link>
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}