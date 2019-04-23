# electron-tray-indicator

<img src="https://raw.githubusercontent.com/bubkoo/electron-tray-indicator/master/screenshot/record.gif" width="240" height="135" />

> A progress indicator in tray for your Electron app.

## Install

```shell
$ npm install electron-tray-indicator --save
```

## Usage

Working with a determinate progress: 

```ts
import { Tray } from 'electron'
import { progress, clean } from 'electron-tray-indicator'

function start(tray: Tray) {
  let p = 0

  const tick = () => {
    progress({
      tray: tray,
      progress: p,
    })

    p += 0.5
    if (p < 100) {
      setTimeout(tick, 16)
    } else {
      // update the tray with your `img`
      tray.setImage(img)
      // clean the background resources (a hidden window)
      clean()
    }
  }

  tick()
}

start()
```

Working with an indeterminate progress:

```ts
import { Tray } from 'electron'
import { indeterminate, clean } from 'electron-tray-indicator'

const stop = indeterminate({
  tray,
})

// just call `stop` when some task finished
stop()

// then update the tray with your `img`
tray.setImage(img)

// finally you can call `clean` to release the background resources
clean()
```


## Examples

Find more examples see the [./examples](https://github.com/bubkoo/electron-tray-indicator/tree/master/examples).

## Contributing

Pull requests and stars are highly welcome.

For bugs and feature requests, please [create an issue](https://github.com/bubkoo/electron-tray-indicator/issues/new).
