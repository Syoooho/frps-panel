package server

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"

	"frps-panel/pkg/config"
)

// Server FRP 插件服务器
type Server struct {
	cfg        *config.Config
	httpServer *http.Server
	client     *http.Client
}

// NewServer 创建服务器实例
func NewServer(cfg *config.Config) *Server {
	return &Server{
		cfg:    cfg,
		client: &http.Client{},
	}
}

// Start 启动服务器
func (s *Server) Start() error {
	addr := fmt.Sprintf("%s:%d", s.cfg.Common.PluginAddr, s.cfg.Common.PluginPort)

	mux := http.NewServeMux()
	mux.HandleFunc("/handler", s.handleFRPRequest)

	s.httpServer = &http.Server{
		Addr:    addr,
		Handler: mux,
	}

	log.Printf("FRP 插件启动在 %s", addr)
	log.Printf("后端 API: %s", s.cfg.Common.BackendURL)

	if s.cfg.Common.TLSMode {
		return s.httpServer.ListenAndServeTLS(
			s.cfg.Common.TLSCertFile,
			s.cfg.Common.TLSKeyFile,
		)
	}

	return s.httpServer.ListenAndServe()
}

// handleFRPRequest 处理 FRP 请求
func (s *Server) handleFRPRequest(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// 读取请求体
	body, err := io.ReadAll(r.Body)
	if err != nil {
		log.Printf("读取请求体失败: %v", err)
		http.Error(w, "Bad request", http.StatusBadRequest)
		return
	}
	defer r.Body.Close()

	// 解析请求
	var req map[string]interface{}
	if err := json.Unmarshal(body, &req); err != nil {
		log.Printf("解析请求失败: %v", err)
		http.Error(w, "Bad request", http.StatusBadRequest)
		return
	}

	op, _ := req["op"].(string)
	log.Printf("收到 FRP 请求: op=%s", op)

	// 转发到后端 API
	resp, err := s.forwardToBackend(body)
	if err != nil {
		log.Printf("转发请求失败: %v", err)
		// 返回默认响应
		defaultResp := map[string]interface{}{
			"reject":        true,
			"reject_reason": fmt.Sprintf("后端服务异常: %v", err),
			"unchange":      true,
		}
		s.writeJSON(w, defaultResp)
		return
	}

	// 返回后端响应
	s.writeJSON(w, resp)
}

// forwardToBackend 转发请求到后端 API
func (s *Server) forwardToBackend(body []byte) (map[string]interface{}, error) {
	url := fmt.Sprintf("%s/api/v1/frp/handler", s.cfg.Common.BackendURL)

	req, err := http.NewRequest(http.MethodPost, url, bytes.NewReader(body))
	if err != nil {
		return nil, err
	}

	req.Header.Set("Content-Type", "application/json")

	resp, err := s.client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	respBody, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	var result map[string]interface{}
	if err := json.Unmarshal(respBody, &result); err != nil {
		return nil, err
	}

	return result, nil
}

// writeJSON 写入 JSON 响应
func (s *Server) writeJSON(w http.ResponseWriter, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(data); err != nil {
		log.Printf("写入响应失败: %v", err)
	}
}
