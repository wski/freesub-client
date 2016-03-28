# CatSnake JS

Docs coming soon

## Usage

### Setup

If you're using npm you can simply require and create a catsnake client.
```javascript
const CatSnake = require('catsnake-client');
const catsnake = new CatSnake('ws://public.catsnake.io', {
    // The common name is how people will know who or what a client is.
    // If no commonName is provided your client will be known as A Random Catsnake
    commonName: 'A Random Catsnake'
});

```

If you're using this without a module builder just go ahead and use the following without the require. CatSnake will
already be defined.
```javascript
const catsnake = new CatSnake('ws://public.catsnake.io', {
    // The common name is how people will know who or what a client is.
    // If no commonName is provided your client will be known as A Random Catsnake
    commonName: 'A Random Catsnake'
});
```


### Subscribe
Before you can start sending messages, you should subscribe to a channel (but you don't have to). Don't worry, it's super easy.

```javascript
CatSnake.subscribe('General', msg => {
    // All messages published to this channel come through here.
    console.log(`We got a new message! ${msg}`);
});
```

If you're passing around some private information you can make your channel private by simply passing in a privateKey.
Anyone who want's to later publish to this channel will need this key to do so!
```javascript
Postbox.subscribe('General', msg => {
    // All messages published to this channel come through here.
    console.log(`We got a new message! ${msg}`);
}, 'ShhThisIsAPrivateChannel');

```

### Publish
Now that you've subscibed to a channel, let's publish a message to all of the other subscribers, and ourselves ofcourse.

```javascript
CatSnake.publish('General', msg => {
    message: 'Ahh! Your dog is attacking me! What is it with mail men and dogs anyways?'
});
```


Whoops! It looks like the general channel is private. Let's pass in the privateKey the same way we do in our subscribe method.
```javascript
CatSnake.publish('General', msg => {
    message: 'Ahh! Your dog is attacking me! What is it with mail men and dogs anyways?'
}, 'ShhThisIsAPrivateChannel');
```

### Clients

Unsubscribe
Well that was easy. Let's go over one last thing, before we get into the more advanced features of jsps.
Once you're done pubsubbing you can unsubscribe from the channel. This will leave your client in an offline state but
you can later reconnect with the same client id via the subscribe method, we will go over this more in the advanced
features below.

```javascript
CatSnake.unsubscribe('General');
```
