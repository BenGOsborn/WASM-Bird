package main

import (
	"fmt"
)

func inc(x *int) {
    *x++;
}

func main() {
    y := 3;

    inc(&y);

    fmt.Println(y);
}