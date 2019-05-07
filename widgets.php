<?php
/*!
 * Copyright 2016 Everex https://everex.io
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

require 'vendor/autoload.php';
$aConfig = require dirname(__FILE__) . '/service/config.php';

$loader = new \Twig\Loader\FilesystemLoader('dist');
$twig = new \Twig\Environment($loader, [
    // 'cache' => __DIR__ . '/cache/compilation_cache',
]);

$scriptAddon = isset($aConfig['scriptAddon']) ? $aConfig['scriptAddon'] : '';

echo $twig->render('widgets.twig', [
    'scriptAddon' => $scriptAddon
]);
