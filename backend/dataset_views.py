import os
import pandas as pd
from django.http import JsonResponse
from rest_framework.decorators import api_view
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

CSV_PATHS = [
    os.path.join("Training", "sp500_companies.csv"),
    "sp500_companies.csv"
]
MAPPER_PATHS = [
    os.path.join("Training", "mapper.json"),
    "mapper.json"
]

def _load_sp500_csv():
    for p in CSV_PATHS:
        if os.path.exists(p):
            return pd.read_csv(p)
    return None

def _load_mapper_path():
    # return first writable/usable path
    for p in MAPPER_PATHS:
        base = os.path.dirname(p)
        if base and not os.path.exists(base):
            try:
                os.makedirs(base, exist_ok=True)
            except Exception:
                continue
        return p
    return "mapper.json"

# Single API: return unique GICS Sector from mapper
gics_list_schema = openapi.Schema(
    type=openapi.TYPE_OBJECT,
    properties={
        'values': openapi.Schema(
            type=openapi.TYPE_ARRAY,
            items=openapi.Schema(type=openapi.TYPE_STRING),
            description='Sorted unique GICS sectors from mapper.json'
        )
    }
)

@swagger_auto_schema(
    method='get',
    operation_description='Get unique GICS Sector values. Uses mapper.json if present; otherwise builds mapper from sp500_companies.csv and saves it.',
    responses={200: gics_list_schema, 500: 'Server Error'}
)
@api_view(['GET'])
def sp500_gics_sectors(request):
    import json
    mapper_path = _load_mapper_path()
    mapper = None
    # Try load mapper
    if os.path.exists(mapper_path):
        try:
            with open(mapper_path, 'r', encoding='utf-8') as f:
                mapper = json.load(f)
        except Exception:
            mapper = None
    # Build mapper if missing
    if mapper is None:
        df = _load_sp500_csv()
        if df is None:
            return JsonResponse({'error': 'sp500_companies.csv not found'}, status=500)
        # Detect columns
        sym_col = None
        for c in ['Symbol', 'Ticker', 'symbol', 'SYMBOL']:
            if c in df.columns:
                sym_col = c
                break
        gics_col = None
        for c in ['GICS Sector', 'Sector', 'GICS_Sector', 'gics_sector']:
            if c in df.columns:
                gics_col = c
                break
        if sym_col is None or gics_col is None:
            return JsonResponse({'error': 'Required columns not found in CSV'}, status=500)
        # Build mapping Symbol -> GICS Sector
        mapper = {}
        for _, row in df[[sym_col, gics_col]].dropna().iterrows():
            sym = str(row[sym_col]).strip()
            gics = str(row[gics_col]).strip()
            if sym and gics:
                mapper[sym] = gics
        # Save mapper
        try:
            with open(mapper_path, 'w', encoding='utf-8') as f:
                json.dump(mapper, f, indent=2)
        except Exception:
            # non-fatal; proceed without saving
            pass
    # Return unique sectors
    values = sorted(set(v for v in mapper.values() if str(v).strip()))
    return JsonResponse({'values': values})
