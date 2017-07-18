var ractive = new Ractive({
  target: '#target',
  template: '#template',
  data: {greeting: "hello", user: "world"}
});

ractive.set('greeting', 'fuck you');