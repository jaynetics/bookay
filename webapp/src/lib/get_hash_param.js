// get value of a pseudo-param from the location hash, e.g. "/foo#bar?baz=qux"
export const getHashParam = (name) =>
  (new URLSearchParams(window.location.hash.split('?').reverse()[0])).get(name)
