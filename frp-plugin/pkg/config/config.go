package config

import (
	"github.com/BurntSushi/toml"
)

// Config 插件配置
type Config struct {
	Common CommonConfig `toml:"common"`
}

// CommonConfig 通用配置
type CommonConfig struct {
	// 插件监听地址
	PluginAddr string `toml:"plugin_addr"`
	PluginPort int    `toml:"plugin_port"`

	// 后端 API 地址
	BackendURL string `toml:"backend_url"`

	// TLS 配置
	TLSMode     bool   `toml:"tls_mode"`
	TLSCertFile string `toml:"tls_cert_file"`
	TLSKeyFile  string `toml:"tls_key_file"`
}

// LoadConfig 加载配置文件
func LoadConfig(path string) (*Config, error) {
	var cfg Config
	if _, err := toml.DecodeFile(path, &cfg); err != nil {
		return nil, err
	}

	// 设置默认值
	if cfg.Common.PluginAddr == "" {
		cfg.Common.PluginAddr = "127.0.0.1"
	}
	if cfg.Common.PluginPort == 0 {
		cfg.Common.PluginPort = 7200
	}
	if cfg.Common.BackendURL == "" {
		cfg.Common.BackendURL = "http://127.0.0.1:8000"
	}

	return &cfg, nil
}
