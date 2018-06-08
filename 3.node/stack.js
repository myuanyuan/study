function one() {
  let a = 1;
  two();
  function two() {
    console.log(a);
    let b = 2;
    function three() {
      debugger;
      console.log(b);
    }
    three();
  }
}
one();