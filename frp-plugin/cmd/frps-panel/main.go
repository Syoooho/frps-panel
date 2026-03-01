package main

import (
	"flag"
	"fmt"
	"log"
	"os"

	"frps-panel/pkg/config"
	"frps-panel/pkg/server"
)

var (
	configFile = flag.String("c", "./frps-panel.toml", "配置文件路径")
	version    = flag.Bool("v", false, "显示版本信息")
)

const Version = "2.0.0"

func main() {
	flag.Parse()

	if *version {
		fmt.Printf("frps-panel version %s\n", Version)
		os.Exit(0)
	}

	// 加载配置
	cfg, err := config.LoadConfig(*configFile)
	if err != nil {
		log.Fatalf("加载配置失败: %v", err)
	}

	// 创建并启动服务器
	srv := server.NewServer(cfg)
	if err := srv.Start(); err != nil {
		log.Fatalf("启动服务器失败: %v", err)
	}
}
