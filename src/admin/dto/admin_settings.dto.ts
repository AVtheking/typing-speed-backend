import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ToBoolean } from 'src/boolean';

enum Languages {
  ENGLISH = 'English',
  SPANISH = 'Spanish',
  FRENCH = 'French',
  HINDI = 'Hindi',
}

enum TimeZones {
  IST = 'IST',
  EST = 'EST',
  CST = 'CST',
  PST = 'PST',
  UTC = 'UTC',
}

export class AdminSettingDto {
  @ApiPropertyOptional({ description: 'The title of the site' })
  @IsString()
  @IsOptional()
  siteTitle?: string;

  @ApiPropertyOptional({ description: 'The meta description of the site' })
  @IsString()
  @IsOptional()
  metaDescription?: string;

  @ApiPropertyOptional({ description: 'The URL of the logo image' })
  @IsString()
  @IsOptional()
  logoImage?: string;

  @ApiPropertyOptional({
    enum: Languages,
    description: 'The default language of the site',
  })
  @IsEnum(Languages)
  @IsOptional()
  defaultLanguage?: Languages;

  @ApiPropertyOptional({
    enum: TimeZones,
    description: 'The default timezone of the site',
  })
  @IsEnum(TimeZones)
  @IsOptional()
  defaultTimeZone?: TimeZones;

  @ApiPropertyOptional({ description: 'Whether to use SEO-friendly URLs' })
  @IsOptional()
  @ToBoolean()
  useSEOFriendlyUrls?: boolean;

  @ApiPropertyOptional({
    description: 'Whether to discourage search engines from indexing the site',
  })
  @IsOptional()
  @ToBoolean()
  discourageSearchEngines?: boolean;

  @ApiPropertyOptional({
    description: 'Whether the site is in maintenance mode',
  })
  @IsOptional()
  @ToBoolean()
  maintainenceMode?: boolean;

  @ApiPropertyOptional({ description: 'The maintenance mode message' })
  @IsString()
  @IsOptional()
  maintainenceMessage?: string;

  @ApiPropertyOptional({
    description: 'Whether to show an EU cookie notification',
  })
  @IsOptional()
  @ToBoolean()
  euCookieNotification?: boolean;

  @ApiPropertyOptional({ description: 'The analytics tracking code' })
  @IsOptional()
  @IsString()
  analyticsTrackingCode?: string;
}

export class ResponseAdminSettingsDto {
  @ApiProperty({ type: AdminSettingDto, description: 'The admin settings' })
  setting: AdminSettingDto;
}
