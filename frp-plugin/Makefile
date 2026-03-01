.PHONY: build clean test run

# 构建目标
build:
	go build -o frps-panel ./cmd/frps-panel

# 清理
clean:
	rm -f frps-panel
	rm -f frps-panel.exe

# 测试
test:
	go test ./...

# 运行
run:
	go run ./cmd/frps-panel -c ./config/frps-panel.toml

# 跨平台编译
build-all:
	GOOS=linux GOARCH=amd64 go build -o frps-panel-linux-amd64 ./cmd/frps-panel
	GOOS=linux GOARCH=arm64 go build -o frps-panel-linux-arm64 ./cmd/frps-panel
	GOOS=windows GOARCH=amd64 go build -o frps-panel-windows-amd64.exe ./cmd/frps-panel
	GOOS=darwin GOARCH=amd64 go build -o frps-panel-darwin-amd64 ./cmd/frps-panel
	GOOS=darwin GOARCH=arm64 go build -o frps-panel-darwin-arm64 ./cmd/frps-panel
