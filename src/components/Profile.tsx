import type { FC } from "react";
import { Icon } from "./Icon.js";
import { RichContent } from "./RichContent.js";

/**
 * Contact item for profile
 * 个人资料联系方式项
 */
export interface ProfileContactItem {
  /**
   * Label for the contact item
   * 联系方式标签
   */
  label: string;
  /**
   * Value/Content of the contact item
   * 联系方式值/内容
   */
  value: string;
  /**
   * Optional link URL (defaults to mailto:value if not provided)
   * 可选链接地址 (如果未提供，默认为 mailto:value)
   */
  link?: string;
  /**
   * Optional icon class
   * 可选图标类名
   */
  icon?: string;
}

/**
 * Profile field item
 * 个人资料字段项
 */
export interface ProfileField {
  /**
   * Title of the field
   * 字段标题
   */
  title: string;

  /**
   * Value of the field (Markdown string or list of strings)
   * 字段值 (Markdown 字符串或字符串列表)
   */
  value: string | string[];

  /**
   * Icon for the field
   * 字段图标
   *
   * @default "envelope"
   */
  icon?: string;
}

/**
 * Profile data structure
 * 个人资料数据结构
 */
export interface ProfileData {
  /**
   * List of custom fields
   * 自定义字段列表
   */
  fields?: ProfileField[];
  /**
   * List of contact items
   * 联系方式列表
   */
  contacts?: ProfileContactItem[];
  /**
   * Optional slogan text (Markdown supported)
   * 可选标语文本 (支持 Markdown)
   */
  slogan?: string;
}

export interface ProfileProps {
  /**
   * Profile data
   * 个人资料数据
   */
  data: ProfileData;
  /**
   * UI labels for the profile section
   * 个人资料部分的 UI 标签
   */
  ui?: {
    contacts?: string;
  };
}

export const Profile: FC<ProfileProps> = ({ data, ui }) => (
  <div className="profile-container card-base">
    <div className="profile-fields-col">
      {data.fields?.map(({ title, value, icon }, index) => (
        <div key={index}>
          <h4 className="profile-label label-sm">
            {icon && <Icon icon={icon} />}
            {title}
          </h4>
          {Array.isArray(value) ? (
            <div className="profile-tags-wrapper">
              {value.map((item, index) => (
                <span key={index} className="profile-tag">
                  {item}
                </span>
              ))}
            </div>
          ) : (
            <RichContent content={value} className="profile-text-value" block />
          )}
        </div>
      ))}
    </div>
    <div className="profile-contact-col">
      <div>
        <h4 className="profile-contact-header label-sm">
          <Icon icon="paper-plane" /> {ui?.contacts ?? "Contacts"}
        </h4>
        <ul className="profile-contact-list">
          {data.contacts?.map((contact, index) => (
            <li key={index} className="profile-contact-item">
              <div className="profile-icon-box">
                <Icon icon={contact.icon ?? "envelope"} className="text-2xl" />
              </div>
              <div className="profile-contact-info">
                <span className="profile-contact-label">{contact.label}</span>
                {contact.link || /^\S+@\S+\.\S+$/.test(contact.value) ? (
                  <a
                    href={contact.link ?? `mailto:${contact.value}`}
                    className="profile-contact-link"
                  >
                    {contact.value}
                  </a>
                ) : (
                  <span className="profile-contact-link">{contact.value}</span>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
      {data.slogan && (
        <div className="profile-slogan-box">
          <Icon icon="quote-left" className="profile-quote-icon" />
          <RichContent content={data.slogan} className="profile-slogan-text" block />
        </div>
      )}
    </div>
  </div>
);
