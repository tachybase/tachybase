export var k = (w, s, n) =>
  new Promise((D, p) => {
    var j = (V) => {
        try {
          N(n.next(V));
        } catch (I) {
          p(I);
        }
      },
      Y = (V) => {
        try {
          N(n.throw(V));
        } catch (I) {
          p(I);
        }
      },
      N = (V) => (V.done ? D(V.value) : Promise.resolve(V.value).then(j, Y));
    N((n = n.apply(w, s)).next());
  });
