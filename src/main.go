package main

import (
	"fmt"
	"math/rand"
)

func main() {
    var arr [20][5]int;

    for i := 0; i < len(arr); i++ {
        for j := 0; j < len(arr[0]); j++ {
            arr[i][j] = rand.Int() % 20;
        }
    }

	fmt.Println(arr);
}