# frankandoak/silo-documentation

Documentation module, comes with the PHP endpoint and the React component. Serves also the none markdown files.

## Usage

```php
$app->register(new \Silo\Documentation\Provider([
    '/silo' => './vendor/frankandoak/silo/doc',
    '' => './doc')
]));
```

```client
## Inside your routing file
const Doc = require('./../vendor-repo/frankandoak/silo-documentation').Doc; 
ReactDOM.render(<Doc page={url.match(/\/doc(.*)$/)[1]}/>, document.getElementById('#doc'));            
```
