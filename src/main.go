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

    switch (3) {
    case 3:
        fmt.Println(3);
    case 4:
        fmt.Println(4);
    default:
        fmt.Println(5);
    }
}