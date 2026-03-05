"""add custom ports for http/https tunnels

Revision ID: 003_add_custom_ports
Revises: 002_add_tunnel_encryption
Create Date: 2026-03-05

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '003_add_custom_ports'
down_revision = '002_add_tunnel_encryption'
branch_labels = None
depends_on = None


def upgrade():
    # 添加自定义端口字段
    op.add_column('tunnels', sa.Column('custom_http_port', sa.Integer(), nullable=True))
    op.add_column('tunnels', sa.Column('custom_https_port', sa.Integer(), nullable=True))


def downgrade():
    op.drop_column('tunnels', 'custom_https_port')
    op.drop_column('tunnels', 'custom_http_port')
