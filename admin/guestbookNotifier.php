<?php

require("phpmailer/PHPMailerAutoload.php");
include "../classes/DBManager.php";
include "../classes/GuestBookEntry.php";

$entries = DbManager::Instance()->getUnreadGuestbookEntries();
if (count($entries) > 0) {
    $mail = new PHPMailer();
    $mail->IsSMTP();
    $mail->Host = "mail.fejesadamfoto.hu";
    $mail->SMTPAuth = true;
    $mail->Username = "no-reply@fejesadamfoto.hu";
    $mail->Password = "P4sadena";

    $mail->From = "no-reply@fejesadamfoto.hu";
    $mail->FromName = "Fejes Ádám Fotó";
    $mail->AddAddress("fejes91@gmail.com");

    $mail->setLanguage('hu', 'phpmailer/language/directory/');
    $mail->WordWrap = 50; // sortörés 50 karakter
    $mail->IsHTML(true); // HTML formátum beállítása
    $mail->Subject = "Guestbook report";

    $mail->Body = "<h2> Guestbook jelentés</h2><p>" . count($entries) . " új bejegyzés érkezett a vendégkönyvbe! <br> http://fejesadamfoto.hu/admin/?page=guestbook</p>";
    if (!$mail->Send()) {
        echo "Nem sikerült az e-mail küldése. <p>";
        echo "Hiba: " . $mail->ErrorInfo;
        exit;
    } else {
        echo "Levél sikeresen elküldve.";
    }
} else {
    echo "Nincs olvasatlan bejegyzés";
}
?>
