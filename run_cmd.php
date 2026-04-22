<?php
$cmd = 'C:\\xampp\\mysql\\bin\\mysql.exe -u root -h 127.0.0.1 -e "SHOW DATABASES"';
$out = [];
$ret = 0;
exec($cmd, $out, $ret);
echo implode("\n", $out);
echo "\nRET: $ret\n";
?>
