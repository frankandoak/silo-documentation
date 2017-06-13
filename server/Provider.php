<?php

namespace Silo\Documentation;

use Pimple\Container;
use Pimple\ServiceProviderInterface;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\JsonResponse;

class Provider implements ServiceProviderInterface
{
    private $routeMap = [];

    public function __construct(array $map = [])
    {
        $this->routeMap = $map;
    }

    public function register(Container $app)
    {
        foreach ($this->routeMap as $mountPoint => $realPath) {
            $app->get("/silo/doc$mountPoint{path}", function($path)use($app,$realPath){
                $file = null;
                if ($realPath) {
                    $file = $realPath.$path;
                    $dir = $realPath.$path;

                    if (file_exists($dir) && is_dir($dir)) {
                        $dir .= strrpos($dir, '/') == strlen($dir) - 1 ? '' : '/';
                        $file = $dir.'index.md';
                    }
                    $file = file_exists($file)?$file:(file_exists($file.'.md')?$file.'.md':null);
                }

                $response = new JsonResponse([
                    'content' => "Content not found"
                ]);
                if ($file) {
                    // Maybe its a markdown ?
                    if (preg_match('/\.md$/', $file)) {
                        // Trick to protect the include from current object scope
                        $render = function($file, $vars = null){
                            ob_start();
                            include $file;
                            return ob_get_clean();
                        };
                        $response = new JsonResponse([
                            'content' => $render($file)
                        ]);
                    } else {
                        $response = new BinaryFileResponse($file);
                    }
                }

                return $response;
            })->assert('path', '.*');
        }
    }
}
