"""add tunnel encryption options

Revision ID: 002_add_tunnel_encryption
Revises: 001_add_security_tables
Create Date: 2026-03-05

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '002_add_tunnel_encryption'
down_revision = '001_add_security_tables'
branch_labels = None
depends_on = None


def upgrade():
    # 添加加密和压缩选项字段
    op.add_column('tunnels', sa.Column('use_encryption', sa.Boolean(), nullable=True, server_default='0'))
    op.add_column('tunnels', sa.Column('use_compression', sa.Boolean(), nullable=True, server_default='0'))


def downgrade():
    op.drop_column('tunnels', 'use_compression')
    op.drop_column('tunnels', 'use_encryption')
